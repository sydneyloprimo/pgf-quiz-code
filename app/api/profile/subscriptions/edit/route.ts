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

interface EditPayload {
  shopify_variant_id: string
  order_interval_frequency: string
  order_interval_unit: string
}

const editRechargeSubscription = async (
  subscriptionId: string,
  payload: EditPayload
): Promise<{
  success: boolean
  error?: string
  subscription?: Record<string, unknown>
}> => {
  const rechargeToken = process.env.RECHARGE_ACCESS_TOKEN

  if (!rechargeToken) {
    return {
      success: false,
      error: 'TOKEN_NOT_CONFIGURED',
    }
  }

  const headers = {
    'X-Recharge-Access-Token': rechargeToken,
    'X-Recharge-Version': '2021-11',
    'Content-Type': 'application/json',
  }

  try {
    const url = `${RECHARGE_API_URL}/subscriptions/${subscriptionId}`

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        external_variant_id: {
          ecommerce: String(payload.shopify_variant_id),
        },
        order_interval_frequency: String(payload.order_interval_frequency),
        order_interval_unit: payload.order_interval_unit,
        charge_interval_frequency: String(payload.order_interval_frequency),
        charge_interval_unit: payload.order_interval_unit,
        use_shopify_variant_defaults: true,
      }),
    })

    const responseText = await response.text()

    if (response.ok) {
      let rechargeData = null
      try {
        rechargeData = responseText ? JSON.parse(responseText) : null
      } catch {
        // ignore parse errors
      }
      return {
        success: true,
        subscription: rechargeData?.subscription,
      }
    }

    let errorDetail = responseText
    try {
      const errBody = responseText ? JSON.parse(responseText) : null
      const raw =
        errBody?.errors ?? errBody?.error ?? errBody?.message ?? responseText
      errorDetail = typeof raw === 'object' ? JSON.stringify(raw) : String(raw)
    } catch {
      // use responseText
    }

    return {
      success: false,
      error: `Recharge ${response.status}: ` + `${errorDetail.slice(0, 200)}`,
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
    const {
      subscriptionId,
      shopifyVariantId,
      orderIntervalFrequency,
      orderIntervalUnit,
    } = body

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'SUBSCRIPTION_ID_REQUIRED' },
        { status: 400 }
      )
    }

    if (!shopifyVariantId || !orderIntervalFrequency || !orderIntervalUnit) {
      return NextResponse.json(
        { error: 'INVALID_EDIT_PAYLOAD' },
        { status: 400 }
      )
    }

    const { shopifyCustomerId, shopifyCustomerGid, email } =
      await getShopifyCustomer(customerAccessToken)

    if (!email) {
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

    const result = await editRechargeSubscription(subscriptionId, {
      shopify_variant_id: shopifyVariantId,
      order_interval_frequency: orderIntervalFrequency,
      order_interval_unit: orderIntervalUnit,
    })

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'EDIT_FAILED',
          details: result.error,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
    })
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
