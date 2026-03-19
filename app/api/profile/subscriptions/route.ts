import { NextRequest, NextResponse } from 'next/server'

import {
  getRechargeCustomerForShopifyCustomer,
  getShopifyCustomer,
} from '@/app/api/profile/subscriptions/_helpers'
import { RECHARGE_API_URL } from '@/constants'

interface RechargeSubscription {
  id: number
  status: string
  payment_status?: string
  next_charge_scheduled_at: string | null
  order_interval_frequency: number
  order_interval_unit: string
  properties: Array<{
    name: string
    value: string
  }>
  product_title: string
  variant_title: string
  shopify_variant_id: number
}

interface RechargeSubscriptionsResponse {
  subscriptions: RechargeSubscription[]
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
  } catch {
    return []
  }
}

const getDeliveryFrequencyForDays = (frequency: number): string => {
  if (frequency === 7) return 'Delivers Weekly'
  if (frequency === 14) return 'Delivers Bi-Weekly'
  return `Delivers Every ${frequency} Days`
}

const formatDeliveryFrequency = (frequency: number, unit: string): string => {
  if (unit === 'week') {
    return frequency === 1
      ? 'Delivers Weekly'
      : `Delivers Every ${frequency} Weeks`
  }
  if (unit === 'day') {
    return getDeliveryFrequencyForDays(frequency)
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
  productTitle: string
  shopifyVariantId: number
  orderIntervalFrequency: number
  orderIntervalUnit: string
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
  // Recharge payment_status values:
  //   paid, pending, failed, refunded, voided
  let paymentStatus: string | undefined
  if (subscription.payment_status) {
    const status = subscription.payment_status.toLowerCase()
    if (status === 'pending' || status === 'failed') {
      paymentStatus = 'Pending Payment'
    } else if (status === 'paid') {
      paymentStatus = undefined // Don't show if paid
    }
  }

  return {
    id: subscription.id.toString(),
    name: petName,
    subscriptionStatus,
    deliveryFrequency,
    renewalDate,
    paymentStatus,
    productTitle: subscription.product_title,
    shopifyVariantId: subscription.shopify_variant_id,
    orderIntervalFrequency: subscription.order_interval_frequency,
    orderIntervalUnit: subscription.order_interval_unit,
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const customerAccessToken = authHeader?.replace('Bearer ', '')

    if (!customerAccessToken) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { shopifyCustomerId, shopifyCustomerGid, email } =
      await getShopifyCustomer(customerAccessToken)

    if (!email) {
      return NextResponse.json({ pets: [] })
    }

    const rechargeCustomer = await getRechargeCustomerForShopifyCustomer(
      shopifyCustomerId ?? '',
      shopifyCustomerGid ?? '',
      email
    )

    if (!rechargeCustomer) {
      return NextResponse.json({ pets: [] })
    }

    const subscriptions = await getRechargeSubscriptions(rechargeCustomer.id)

    const pets = subscriptions.map(mapSubscriptionToPet)

    const response = NextResponse.json({ pets })
    response.headers.set(
      'Cache-Control',
      'private, no-store, no-cache, must-revalidate'
    )
    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    )
  }
}
