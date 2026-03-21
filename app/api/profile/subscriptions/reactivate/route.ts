import { NextRequest, NextResponse } from 'next/server'

import {
  getRechargeCustomerForShopifyCustomer,
  getShopifyCustomer,
} from '@/app/api/profile/subscriptions/_helpers'
import { RECHARGE_API_URL } from '@/constants'

interface RechargeSubscription {
  id: number
  customer_id: number
  status?: string
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

    const data: {
      subscription: RechargeSubscription
    } = await response.json()

    return data.subscription || null
  } catch {
    return null
  }
}

interface SubscriptionWithStatus {
  status?: string
}

const hasStatus = (obj: unknown): obj is SubscriptionWithStatus =>
  typeof obj === 'object' && obj !== null

const parseSubscriptionStatus = (
  responseText: string
): {
  subscription: unknown
  statusUpper: string | null
} => {
  try {
    const data = responseText ? JSON.parse(responseText) : null
    const subscription = data?.subscription
    const statusUpper = subscription?.status?.toString().toUpperCase() ?? null
    return { subscription, statusUpper }
  } catch {
    return { subscription: null, statusUpper: null }
  }
}

const reactivateRechargeSubscription = async (
  subscriptionId: string
): Promise<{ success: boolean; error?: string }> => {
  const rechargeToken = process.env.RECHARGE_ACCESS_TOKEN

  if (!rechargeToken) {
    return { success: false, error: 'TOKEN_NOT_CONFIGURED' }
  }

  const headers = {
    'X-Recharge-Access-Token': rechargeToken,
    'X-Recharge-Version': '2021-11',
    'Content-Type': 'application/json',
  }

  try {
    // Try dedicated activate endpoint first (mirrors POST .../cancel)
    const activateUrl = `${RECHARGE_API_URL}/subscriptions/${subscriptionId}/activate`
    const activateResponse = await fetch(activateUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    })
    const activateText = await activateResponse.text()

    if (activateResponse.ok) {
      const { statusUpper } = parseSubscriptionStatus(activateText)
      if (statusUpper === 'ACTIVE') {
        return { success: true }
      }
      // If activate endpoint returned 200 but status not ACTIVE, fall through to PUT
    } else if (activateResponse.status !== 404) {
      let detail = activateText
      try {
        const err = activateText ? JSON.parse(activateText) : null
        detail = err?.errors ?? err?.error ?? err?.message ?? activateText
      } catch {
        // use activateText
      }
      return {
        success: false,
        error:
          `Recharge activate` +
          ` ${activateResponse.status}:` +
          ` ${String(detail).slice(0, 200)}`,
      }
    }

    // Fallback: PUT with only status (minimal body per Recharge docs)
    const updateUrl = `${RECHARGE_API_URL}/subscriptions/${subscriptionId}`
    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        subscription: { status: 'ACTIVE' },
      }),
    })

    const responseText = await response.text()

    if (response.ok) {
      const { subscription, statusUpper } =
        parseSubscriptionStatus(responseText)
      if (statusUpper === 'ACTIVE') {
        return { success: true }
      }

      const status = hasStatus(subscription) ? subscription.status : null
      return {
        success: false,
        error:
          `Status after update: ${status ?? 'unknown'}. ` +
          'Recharge may not support reactivating' +
          ' this subscription via API.',
      }
    }

    let errorDetail = responseText
    try {
      const errBody = responseText ? JSON.parse(responseText) : null
      errorDetail =
        errBody?.errors ?? errBody?.error ?? errBody?.message ?? responseText
    } catch {
      // use responseText
    }

    return {
      success: false,
      error:
        `Recharge ${response.status}:` +
        ` ${String(errorDetail).slice(0, 200)}`,
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

    const { shopifyCustomerId, shopifyCustomerGid, email } =
      await getShopifyCustomer(customerAccessToken)

    if (!shopifyCustomerId && !shopifyCustomerGid && !email) {
      return NextResponse.json({ error: 'CUSTOMER_NOT_FOUND' }, { status: 404 })
    }

    const rechargeCustomer = await getRechargeCustomerForShopifyCustomer(
      shopifyCustomerId ?? '',
      shopifyCustomerGid ?? '',
      email
    )

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

    const result = await reactivateRechargeSubscription(subscriptionId)

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'REACTIVATION_FAILED',
          details: result.error,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        details: message,
      },
      { status: 500 }
    )
  }
}
