import { NextRequest, NextResponse } from 'next/server'

import { RECHARGE_API_URL } from '@/constants'
import { client } from '@/shopify/client'
import { GetCustomerDocument } from '@/shopify/generated/graphql'

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
  shopify_customer_id?: string
  external_id?: string
  email?: string
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

const normalizeToNumericId = (id: string): string => {
  const gidMatch = id.match(/gid:\/\/shopify\/Customer\/(\d+)/)
  return gidMatch ? gidMatch[1] : id.replace(/\D/g, '') || id
}

const shopifyIdsMatch = (
  rechargeId: string,
  shopifyCustomerId: string,
  shopifyCustomerGid: string
): boolean => {
  const normalized = normalizeToNumericId(rechargeId)
  return (
    rechargeId === shopifyCustomerId ||
    rechargeId === shopifyCustomerGid ||
    normalized === shopifyCustomerId
  )
}

const getShopifyCustomer = async (
  customerAccessToken: string
): Promise<{
  shopifyCustomerId: string | null
  shopifyCustomerGid: string | null
  email: string | null
}> => {
  try {
    const data = await client.request(GetCustomerDocument, {
      customerAccessToken,
    })

    if (!data?.customer?.id) {
      return { shopifyCustomerId: null, shopifyCustomerGid: null, email: null }
    }

    const gid = data.customer.id
    const shopifyCustomerId = extractShopifyCustomerId(gid)

    return {
      shopifyCustomerId,
      shopifyCustomerGid: shopifyCustomerId ? gid : null,
      email: data.customer.email || null,
    }
  } catch {
    return { shopifyCustomerId: null, shopifyCustomerGid: null, email: null }
  }
}

const getRechargeCustomerForShopifyCustomer = async (
  shopifyCustomerId: string,
  shopifyCustomerGid: string,
  email: string | null
): Promise<RechargeCustomer | null> => {
  const rechargeToken = process.env.RECHARGE_ACCESS_TOKEN

  if (!rechargeToken) {
    return null
  }

  const idsMatch = (rechargeId: string | undefined): boolean => {
    if (!rechargeId) return false
    return shopifyIdsMatch(
      String(rechargeId),
      shopifyCustomerId,
      shopifyCustomerGid
    )
  }

  const tryLookupById = async (
    idParam: string
  ): Promise<RechargeCustomer | null> => {
    const url = `${RECHARGE_API_URL}/customers?shopify_customer_id=${encodeURIComponent(idParam)}`

    const response = await fetch(url, {
      headers: {
        'X-Recharge-Access-Token': rechargeToken,
        'X-Recharge-Version': '2021-11',
      },
    })

    if (!response.ok) {
      return null
    }

    const data: RechargeCustomersResponse = await response.json()

    if (!data.customers || data.customers.length === 0) {
      return null
    }

    const match = data.customers.find(
      (c) => idsMatch(c.shopify_customer_id) || idsMatch(c.external_id)
    )
    return match ?? null
  }

  const tryLookupByEmail = async (): Promise<RechargeCustomer | null> => {
    if (!email) return null

    const url = `${RECHARGE_API_URL}/customers?email=${encodeURIComponent(email)}`

    const response = await fetch(url, {
      headers: {
        'X-Recharge-Access-Token': rechargeToken,
        'X-Recharge-Version': '2021-11',
      },
    })

    if (!response.ok) {
      return null
    }

    const data: RechargeCustomersResponse = await response.json()

    if (!data.customers || data.customers.length === 0) {
      return null
    }

    const byId = data.customers.find(
      (c) => idsMatch(c.shopify_customer_id) || idsMatch(c.external_id)
    )
    if (byId) return byId

    if (
      data.customers.length === 1 &&
      data.customers[0].email?.toLowerCase() === email.toLowerCase()
    ) {
      return data.customers[0]
    }

    return null
  }

  try {
    if (shopifyCustomerId) {
      const byNumeric = await tryLookupById(shopifyCustomerId)
      if (byNumeric) return byNumeric
    }

    if (shopifyCustomerGid) {
      const byGid = await tryLookupById(shopifyCustomerGid)
      if (byGid) return byGid
    }

    return await tryLookupByEmail()
  } catch {
    return null
  }
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
