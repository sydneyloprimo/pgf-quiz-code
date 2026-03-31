import { NextRequest, NextResponse } from 'next/server'

import { getAdminUrl, resolveCustomerGid } from '@/app/api/profile/_utils'

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
        query: `mutation CustomerDelete(
          $input: CustomerDeleteInput!
        ) {
          customerDelete(input: $input) {
            deletedCustomerId
            userErrors {
              field
              message
            }
          }
        }`,
        variables: {
          input: {
            id: customerGid,
          },
        },
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'ADMIN_API_FAILED' }, { status: 502 })
    }

    const json = await res.json()
    const userErrors = json?.data?.customerDelete?.userErrors ?? []

    if (userErrors.length > 0) {
      return NextResponse.json(
        { error: 'DELETE_FAILED', details: userErrors },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Customer delete error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    )
  }
}
