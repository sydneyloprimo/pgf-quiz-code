import { NextRequest, NextResponse } from 'next/server'

import { DOG_PROFILE_SEPARATOR } from '@/constants'

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION
const SHOPIFY_ADMIN_API_BASE = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}`
const CUSTOMERS_URL = `${SHOPIFY_ADMIN_API_BASE}/customers.json`

interface CustomerCreateRequest {
  email: string
  firstName?: string
  lastName?: string
  note?: string
  tags?: string[]
}

interface ShopifyCustomerResponse {
  customer?: {
    id: number
    email: string
    note?: string | null
    tags?: string
  }
  errors?: Record<string, string[]>
}

interface ShopifyCustomersSearchResponse {
  customers?: Array<{
    id: number
    email: string
    note?: string | null
    tags?: string
  }>
}

interface UpdateExistingCustomerParams {
  adminToken: string
  email: string
  firstName?: string
  lastName?: string
  note: string
  tags: string[]
}

async function updateExistingCustomerWithQuizData(
  params: UpdateExistingCustomerParams
): Promise<{ customerId: number; email: string } | null> {
  const { adminToken, email, firstName, lastName, note, tags } = params

  const searchQuery = `email:"${email}"`
  const searchUrl = `${SHOPIFY_ADMIN_API_BASE}/customers/search.json?query=${encodeURIComponent(searchQuery)}`

  const searchResponse = await fetch(searchUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
  })

  if (!searchResponse.ok) {
    console.error(
      'Shopify customer search failed:',
      await searchResponse.text()
    )
    return null
  }

  const searchData: ShopifyCustomersSearchResponse = await searchResponse.json()
  const existingCustomer = searchData.customers?.find(
    (c) => c.email?.toLowerCase() === email.toLowerCase()
  )

  if (!existingCustomer) {
    console.error('Existing customer not found after duplicate email error')
    return null
  }

  const existingNote = existingCustomer.note?.trim() ?? ''
  const mergedNote = existingNote
    ? `${existingNote}${DOG_PROFILE_SEPARATOR}${note}`
    : note

  const existingTags = existingCustomer.tags
    ? existingCustomer.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : []
  const mergedTagsSet = new Set([...existingTags, ...tags])
  const mergedTags = Array.from(mergedTagsSet).join(', ')

  const updatePayload: Record<string, unknown> = {
    note: mergedNote,
    tags: mergedTags,
  }
  if (firstName) updatePayload.first_name = firstName
  if (lastName) updatePayload.last_name = lastName

  const updateUrl = `${SHOPIFY_ADMIN_API_BASE}/customers/${existingCustomer.id}.json`
  const updateResponse = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ customer: updatePayload }),
  })

  if (!updateResponse.ok) {
    try {
      const updateData = await updateResponse.json()
      console.error('Shopify customer update failed:', updateData)
    } catch {
      console.error('Shopify customer update failed: non-JSON response')
    }
    return null
  }

  return {
    customerId: existingCustomer.id,
    email: existingCustomer.email,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CustomerCreateRequest = await request.json()
    const { email, firstName, lastName, note, tags } = body

    if (!email) {
      return NextResponse.json({ error: 'EMAIL_REQUIRED' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'INVALID_EMAIL' }, { status: 400 })
    }

    const adminToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN
    if (!adminToken) {
      console.error('SHOPIFY_ADMIN_API_ACCESS_TOKEN is not configured')
      return NextResponse.json(
        { error: 'SERVER_CONFIGURATION_ERROR' },
        { status: 500 }
      )
    }

    const customerPayload: Record<string, unknown> = {
      email,
      accepts_marketing: true,
      verified_email: true,
    }

    if (firstName) {
      customerPayload.first_name = firstName
    }
    if (lastName) {
      customerPayload.last_name = lastName
    }
    if (note) {
      customerPayload.note = note
    }
    if (tags && tags.length > 0) {
      customerPayload.tags = tags.join(', ')
    }

    const response = await fetch(CUSTOMERS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({
        customer: customerPayload,
      }),
    })

    const data: ShopifyCustomerResponse = await response.json()

    if (!response.ok) {
      if (
        data.errors?.email?.includes('has already been taken') &&
        note?.trim()
      ) {
        const updateResult = await updateExistingCustomerWithQuizData({
          adminToken,
          email,
          firstName,
          lastName,
          note: note ?? '',
          tags: tags ?? [],
        })
        if (updateResult) {
          return NextResponse.json(updateResult)
        }
      }

      console.error('Shopify Admin API error:', data.errors)
      return NextResponse.json(
        { error: 'CUSTOMER_CREATION_FAILED', details: data.errors },
        { status: response.status }
      )
    }

    if (data.customer) {
      return NextResponse.json({
        customerId: data.customer.id,
        email: data.customer.email,
      })
    }

    return NextResponse.json({ error: 'UNEXPECTED_RESPONSE' }, { status: 500 })
  } catch (error) {
    console.error('Customer creation error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    )
  }
}
