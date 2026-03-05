import { NextRequest, NextResponse } from 'next/server'

import { client } from '@/shopify/client'
import { GetCustomerDocument } from '@/shopify/generated/graphql'

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION
const ADMIN_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`

const BIRTHDATE_NAMESPACE = 'custom'
const BIRTHDATE_KEY = 'birthdate'

const BIRTHDATE_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

interface BirthdatePostBody {
  birthdate?: string
}

async function resolveCustomerGid(
  customerAccessToken: string
): Promise<string | null> {
  try {
    const data = await client.request(GetCustomerDocument, {
      customerAccessToken,
    })
    return data?.customer?.id ?? null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
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

    const adminToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN
    if (!adminToken) {
      return NextResponse.json(
        { error: 'SERVER_CONFIGURATION_ERROR' },
        { status: 500 }
      )
    }

    const res = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({
        query: `query CustomerMetafield(
          $id: ID!,
          $ns: String!,
          $key: String!
        ) {
          customer(id: $id) {
            metafield(namespace: $ns, key: $key) {
              value
            }
          }
        }`,
        variables: {
          id: customerGid,
          ns: BIRTHDATE_NAMESPACE,
          key: BIRTHDATE_KEY,
        },
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'ADMIN_API_FAILED' }, { status: 502 })
    }

    const json = await res.json()
    const value = json?.data?.customer?.metafield?.value ?? null

    return NextResponse.json({ birthdate: value })
  } catch (error) {
    console.error('Profile birthdate read error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    )
  }
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

    const body = (await request.json()) as BirthdatePostBody
    const { birthdate } = body

    const trimmedBirthdate =
      typeof birthdate === 'string' ? birthdate.trim() : ''
    if (!trimmedBirthdate) {
      return NextResponse.json({ error: 'BIRTHDATE_REQUIRED' }, { status: 400 })
    }

    if (!BIRTHDATE_DATE_REGEX.test(trimmedBirthdate)) {
      return NextResponse.json(
        { error: 'BIRTHDATE_INVALID_FORMAT' },
        { status: 400 }
      )
    }

    const customerGid = await resolveCustomerGid(customerAccessToken)
    if (!customerGid) {
      return NextResponse.json({ error: 'CUSTOMER_NOT_FOUND' }, { status: 404 })
    }

    const adminToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN
    if (!adminToken) {
      return NextResponse.json(
        { error: 'SERVER_CONFIGURATION_ERROR' },
        { status: 500 }
      )
    }

    const metafieldsSetResponse = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({
        query: `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields { key namespace value }
            userErrors { field message code }
          }
        }`,
        variables: {
          metafields: [
            {
              ownerId: customerGid,
              namespace: BIRTHDATE_NAMESPACE,
              key: BIRTHDATE_KEY,
              type: 'date',
              value: trimmedBirthdate,
            },
          ],
        },
      }),
    })

    if (!metafieldsSetResponse.ok) {
      return NextResponse.json(
        { error: 'METAFIELD_UPDATE_FAILED' },
        { status: 502 }
      )
    }

    const metafieldsData = await metafieldsSetResponse.json()
    const userErrors = metafieldsData?.data?.metafieldsSet?.userErrors ?? []
    if (userErrors.length > 0) {
      return NextResponse.json(
        { error: 'METAFIELD_UPDATE_FAILED', details: userErrors },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile birthdate update error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    )
  }
}
