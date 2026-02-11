import { NextRequest, NextResponse } from 'next/server'

import { client } from '@/shopify/client'
import { GetCustomerDocument } from '@/shopify/generated/graphql'

const RECHARGE_API_URL = 'https://api.rechargeapps.com'

interface RechargeSubscription {
  id: number
  status: string
  payment_status?: string
  next_charge_scheduled_at: string | null
  order_interval_frequency: number
  order_interval_unit: string
  properties: Array<{ name: string; value: string }>
  product_title: string
  variant_title: string
}

interface RechargeCustomer {
  id: number
  shopify_customer_id: string
  email: string
}

interface RechargeSubscriptionsResponse {
  subscriptions: RechargeSubscription[]
}

interface RechargeCustomersResponse {
  customers: RechargeCustomer[]
}

const extractShopifyCustomerId = (gid: string): string | null => {
  const match = gid.match(/gid:\/\/shopify\/Customer\/(\d+)/)
  return match ? match[1] : null
}

const getShopifyCustomer = async (
  customerAccessToken: string
): Promise<{
  id: string | null
  email: string | null
}> => {
  try {
    const data = await client.request(GetCustomerDocument, {
      customerAccessToken,
    })

    if (!data?.customer) {
      return { id: null, email: null }
    }

    const shopifyCustomerId = data.customer.id
      ? extractShopifyCustomerId(data.customer.id)
      : null

    return {
      id: shopifyCustomerId,
      email: data.customer.email || null,
    }
  } catch (error) {
    return { id: null, email: null }
  }
}

const getRechargeCustomer = async (
  shopifyCustomerId: string | null,
  email: string | null
): Promise<RechargeCustomer | null> => {
  const rechargeToken = process.env.RECHARGE_ACCESS_TOKEN

  if (!rechargeToken) {
    return null
  }

  // Try by shopify_customer_id first
  if (shopifyCustomerId) {
    try {
      const url = `${RECHARGE_API_URL}/customers?shopify_customer_id=${shopifyCustomerId}`

      const response = await fetch(url, {
        headers: {
          'X-Recharge-Access-Token': rechargeToken,
          'X-Recharge-Version': '2021-11',
        },
      })

      if (response.ok) {
        const data: RechargeCustomersResponse = await response.json()

        if (data.customers && data.customers.length > 0) {
          return data.customers[0]
        }
      }
    } catch (error) {
      // Silently fail and try email lookup
    }
  }

  // Fallback to email lookup
  if (email) {
    try {
      const url = `${RECHARGE_API_URL}/customers?email=${encodeURIComponent(email)}`

      const response = await fetch(url, {
        headers: {
          'X-Recharge-Access-Token': rechargeToken,
          'X-Recharge-Version': '2021-11',
        },
      })

      if (response.ok) {
        const data: RechargeCustomersResponse = await response.json()

        if (data.customers && data.customers.length > 0) {
          return data.customers[0]
        }
      }
    } catch (error) {
      // Silently fail
    }
  }

  return null
}

const getRechargeSubscriptions = async (
  customerId: number
): Promise<RechargeSubscription[]> => {
  const rechargeToken = process.env.RECHARGE_ACCESS_TOKEN

  if (!rechargeToken) {
    return []
  }

  try {
    const url = `${RECHARGE_API_URL}/subscriptions?customer_id=${customerId}`

    const response = await fetch(url, {
      headers: {
        'X-Recharge-Access-Token': rechargeToken,
        'X-Recharge-Version': '2021-11',
      },
    })

    if (!response.ok) {
      return []
    }

    const data: RechargeSubscriptionsResponse = await response.json()

    return data.subscriptions || []
  } catch (error) {
    return []
  }
}

const formatDeliveryFrequency = (frequency: number, unit: string): string => {
  if (unit === 'week') {
    return frequency === 1
      ? 'Delivers Weekly'
      : `Delivers Every ${frequency} Weeks`
  }
  if (unit === 'day') {
    return frequency === 7
      ? 'Delivers Weekly'
      : frequency === 14
        ? 'Delivers Bi-Weekly'
        : `Delivers Every ${frequency} Days`
  }
  return `Delivers Every ${frequency} ${unit}s`
}

const formatRenewalDate = (dateString: string | null): string | undefined => {
  if (!dateString) return undefined
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const mapSubscriptionToPet = (
  subscription: RechargeSubscription
): {
  id: string
  name: string
  subscriptionStatus: 'active' | 'expired'
  deliveryFrequency: string
  renewalDate?: string
  paymentStatus?: string
} => {
  const dogNameProperty = subscription.properties?.find(
    (prop) => prop.name === 'Dog Name'
  )
  const petName =
    dogNameProperty?.value || subscription.product_title || 'Subscription'

  // Active subscriptions: ACTIVE, QUEUED, ONETIME
  // Expired: CANCELLED, EXPIRED
  // Note: Recharge statuses are typically uppercase
  const statusUpper = subscription.status?.toUpperCase()
  const isActive =
    statusUpper === 'ACTIVE' ||
    statusUpper === 'QUEUED' ||
    statusUpper === 'ONETIME'
  const subscriptionStatus: 'active' | 'expired' = isActive
    ? 'active'
    : 'expired'

  const deliveryFrequency = formatDeliveryFrequency(
    subscription.order_interval_frequency,
    subscription.order_interval_unit
  )

  const renewalDate = formatRenewalDate(subscription.next_charge_scheduled_at)

  // Map payment_status to a user-friendly string
  // Recharge payment_status values: paid, pending, failed, refunded, voided
  let paymentStatus: string | undefined
  if (subscription.payment_status) {
    const status = subscription.payment_status.toLowerCase()
    if (status === 'pending' || status === 'failed') {
      paymentStatus = 'Pending Payment'
    } else if (status === 'paid') {
      paymentStatus = undefined // Don't show anything if paid
    }
  }

  return {
    id: subscription.id.toString(),
    name: petName,
    subscriptionStatus,
    deliveryFrequency,
    renewalDate,
    paymentStatus,
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const customerAccessToken = authHeader?.replace('Bearer ', '')

    if (!customerAccessToken) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { id: shopifyCustomerId, email } =
      await getShopifyCustomer(customerAccessToken)

    if (!shopifyCustomerId && !email) {
      return NextResponse.json({ pets: [] })
    }

    const rechargeCustomer = await getRechargeCustomer(shopifyCustomerId, email)

    if (!rechargeCustomer) {
      return NextResponse.json({ pets: [] })
    }

    const subscriptions = await getRechargeSubscriptions(rechargeCustomer.id)

    const pets = subscriptions.map(mapSubscriptionToPet)

    return NextResponse.json({ pets })
  } catch (error) {
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    )
  }
}
