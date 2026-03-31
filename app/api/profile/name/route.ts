import { NextRequest, NextResponse } from 'next/server'

import { getAdminUrl, resolveCustomerGid } from '@/app/api/profile/_utils'

interface NamePostBody {
  firstName?: string
  lastName?: string
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const customerAccessToken = authHeader?.replace(/^Bearer\s+/i, '')?.trim()

    if (!customerAccessToken) {
      return NextResponse.json(
        { error: 'CUSTOMER_ACCESS_TOKEN_REQUIRED' },
        { status: 401 }
      )
    }

    const body = (await request.json()) as NamePostBody
    const { firstName, lastName } = body

    if (typeof firstName !== 'string' || typeof lastName !== 'string') {
      return NextResponse.json({ error: 'NAME_REQUIRED' }, { status: 400 })
    }

    const trimmedFirst = firstName.trim()
    const trimmedLast = lastName.trim()

    if (!trimmedFirst || !trimmedLast) {
      return NextResponse.json({ error: 'NAME_REQUIRED' }, { status: 400 })
    }

    const customerGid = await resolveCustomerGid(customerAccessToken)
    if (!customerGid) {
      return NextResponse.json({ error: 'CUSTOMER_NOT_FOUND' }, { status: 404 })
    }

    const adminUrl = getAdminUrl()
    if (!adminUrl) {
      return NextResponse.json(
        { error: 'SERVER_CONFIGURATION_ERROR' },
        { status: 500 }
      )
    }

    const adminToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN
    if (!adminToken) {
      return NextResponse.json(
        { error: 'SERVER_CONFIGURATION_ERROR' },
        { status: 500 }
      )
    }

    const res = await fetch(adminUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({
        query: `mutation CustomerUpdate(
          $input: CustomerInput!
        ) {
          customerUpdate(input: $input) {
            customer {
              id
              firstName
              lastName
            }
            userErrors {
              field
              message
            }
          }
        }`,
        variables: {
          input: {
            id: customerGid,
            firstName: trimmedFirst,
            lastName: trimmedLast,
          },
        },
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'ADMIN_API_FAILED' }, { status: 502 })
    }

    const json = await res.json()
    const userErrors = json?.data?.customerUpdate?.userErrors ?? []

    if (userErrors.length > 0) {
      return NextResponse.json(
        { error: 'UPDATE_FAILED', details: userErrors },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile name update error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    )
  }
}
