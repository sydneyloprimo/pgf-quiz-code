import { NextRequest, NextResponse } from 'next/server'

const SHOPIFY_ADMIN_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/customers.json`

interface CustomerCreateRequest {
  email: string
}

interface ShopifyCustomerResponse {
  customer?: {
    id: number
    email: string
  }
  errors?: Record<string, string[]>
}

export async function POST(request: NextRequest) {
  try {
    const body: CustomerCreateRequest = await request.json()
    const { email } = body

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

    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({
        customer: {
          email,
          accepts_marketing: true,
          verified_email: true,
        },
      }),
    })

    const data: ShopifyCustomerResponse = await response.json()

    if (!response.ok) {
      if (data.errors?.email?.includes('has already been taken')) {
        return NextResponse.json(
          { error: 'EMAIL_ALREADY_EXISTS' },
          { status: 409 }
        )
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
