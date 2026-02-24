import { NextRequest, NextResponse } from 'next/server'

import { RECHARGE_API_URL } from '@/constants'
import { client } from '@/shopify/client'
import { GetCustomerDocument } from '@/shopify/generated/graphql'

interface RechargeSubscription {
  id: number
  customer_id: number
}

interface RechargeCustomer {
  id: number
  shopify_customer_id: string
}

interface RechargeCustomersResponse {
  customers: RechargeCustomer[]
}

const extractShopifyCustomerId = (gid: string): string | null => {
  const match = gid.match(/gid:\/\/shopify\/Customer\/(\d+)/)
  return match ? match[1] : null
}

const getShopifyCustomerId = async (
  customerAccessToken: string
): Promise<string | null> => {
  try {
    const data = await client.request(GetCustomerDocument, {
      customerAccessToken,
    })

    if (!data?.customer?.id) {
      return null
    }

    return extractShopifyCustomerId(data.customer.id)
  } catch (error) {
    return null
  }
}

const getRechargeCustomer = async (
  shopifyCustomerId: string
): Promise<RechargeCustomer | null> => {
  const rechargeToken = process.env.RECHARGE_ACCESS_TOKEN

  if (!rechargeToken) {
    return null
  }

  try {
    const response = await fetch(
      `${RECHARGE_API_URL}/customers?shopify_customer_id=${shopifyCustomerId}`,
      {
        headers: {
          'X-Recharge-Access-Token': rechargeToken,
          'X-Recharge-Version': '2021-11',
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data: RechargeCustomersResponse = await response.json()

    if (data.customers && data.customers.length > 0) {
      return data.customers[0]
    }

    return null
  } catch (error) {
    return null
  }
}

const getRechargeSubscription = async (
  subscriptionId: string
): Promise<RechargeSubscription | null> => {
  const rechargeToken = process.env.RECHARGE_ACCESS_TOKEN

  if (!rechargeToken) {
    return null
  }

  try {
    const response = await fetch(
      `${RECHARGE_API_URL}/subscriptions/${subscriptionId}`,
      {
        headers: {
          'X-Recharge-Access-Token': rechargeToken,
          'X-Recharge-Version': '2021-11',
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data: { subscription: RechargeSubscription } = await response.json()

    return data.subscription || null
  } catch (error) {
    return null
  }
}

const cancelRechargeSubscription = async (
  subscriptionId: string
): Promise<{ success: boolean; error?: string }> => {
  const rechargeToken = process.env.RECHARGE_ACCESS_TOKEN

  if (!rechargeToken) {
    return { success: false, error: 'TOKEN_NOT_CONFIGURED' }
  }

  try {
    // Try the dedicated cancel endpoint first (POST with empty JSON body)
    const cancelUrl = `${RECHARGE_API_URL}/subscriptions/${subscriptionId}/cancel`

    const response = await fetch(cancelUrl, {
      method: 'POST',
      headers: {
        'X-Recharge-Access-Token': rechargeToken,
        'X-Recharge-Version': '2021-11',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    const responseText = await response.text()

    if (response.ok) {
      // Verify cancellation by checking the response
      try {
        const responseData = responseText ? JSON.parse(responseText) : null
        const subscription = responseData?.subscription
        if (
          subscription?.status === 'CANCELLED' ||
          subscription?.cancelled_at
        ) {
          return { success: true }
        }
      } catch (parseError) {
        // If response is not JSON, assume success if status is 200/201/204
        if ([200, 201, 204].includes(response.status)) {
          return { success: true }
        }
      }
    }

    // If cancel endpoint doesn't work, try PUT with status and cancellation_reason
    const updateUrl = `${RECHARGE_API_URL}/subscriptions/${subscriptionId}`
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'X-Recharge-Access-Token': rechargeToken,
        'X-Recharge-Version': '2021-11',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: {
          status: 'CANCELLED',
          cancellation_reason: 'customer',
          cancellation_reason_comments:
            'Cancelled by customer via profile page',
        },
      }),
    })

    const updateResponseText = await updateResponse.text()

    if (updateResponse.ok) {
      // Verify cancellation by checking the response
      const updateResponseData = updateResponseText
        ? JSON.parse(updateResponseText)
        : null
      const subscription = updateResponseData?.subscription

      if (subscription?.status === 'CANCELLED' || subscription?.cancelled_at) {
        return { success: true }
      } else {
        return {
          success: false,
          error: `CANCEL_FAILED: Subscription still active. Status: ${subscription?.status}`,
        }
      }
    }

    return {
      success: false,
      error: `CANCEL_FAILED: ${updateResponse.status} ${updateResponseText}`,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const customerAccessToken = authHeader?.replace('Bearer ', '')

    if (!customerAccessToken) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const body = await request.json()
    const { subscriptionId } = body

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'SUBSCRIPTION_ID_REQUIRED' },
        { status: 400 }
      )
    }

    const shopifyCustomerId = await getShopifyCustomerId(customerAccessToken)

    if (!shopifyCustomerId) {
      return NextResponse.json({ error: 'CUSTOMER_NOT_FOUND' }, { status: 404 })
    }

    const rechargeCustomer = await getRechargeCustomer(shopifyCustomerId)

    if (!rechargeCustomer) {
      return NextResponse.json(
        { error: 'RECHARGE_CUSTOMER_NOT_FOUND' },
        { status: 404 }
      )
    }

    const subscription = await getRechargeSubscription(subscriptionId)

    if (!subscription) {
      return NextResponse.json(
        { error: 'SUBSCRIPTION_NOT_FOUND' },
        { status: 404 }
      )
    }

    if (subscription.customer_id !== rechargeCustomer.id) {
      return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
    }

    const result = await cancelRechargeSubscription(subscriptionId)

    if (!result.success) {
      return NextResponse.json(
        { error: 'CANCELLATION_FAILED', details: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    )
  }
}
