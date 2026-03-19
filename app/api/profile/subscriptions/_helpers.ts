import { RECHARGE_API_URL } from '@/constants'
import { client } from '@/shopify/client'
import { GetCustomerDocument } from '@/shopify/generated/graphql'

export interface RechargeCustomer {
  id: number
  shopify_customer_id?: string
  external_id?: string
  email?: string
}

export interface RechargeCustomersResponse {
  customers: RechargeCustomer[]
}

export interface ShopifyCustomerInfo {
  shopifyCustomerId: string | null
  shopifyCustomerGid: string | null
  email: string | null
}

export const extractShopifyCustomerId = (gid: string): string | null => {
  const match = gid.match(/gid:\/\/shopify\/Customer\/(\d+)/)
  return match ? match[1] : null
}

export const normalizeToNumericId = (id: string): string => {
  const gidMatch = id.match(/gid:\/\/shopify\/Customer\/(\d+)/)
  return gidMatch ? gidMatch[1] : id.replace(/\D/g, '') || id
}

export const shopifyIdsMatch = (
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

export const getShopifyCustomer = async (
  customerAccessToken: string
): Promise<ShopifyCustomerInfo> => {
  try {
    const data = await client.request(GetCustomerDocument, {
      customerAccessToken,
    })

    if (!data?.customer?.id) {
      return {
        shopifyCustomerId: null,
        shopifyCustomerGid: null,
        email: null,
      }
    }

    const gid = data.customer.id
    const shopifyCustomerId = extractShopifyCustomerId(gid)

    return {
      shopifyCustomerId,
      shopifyCustomerGid: shopifyCustomerId ? gid : null,
      email: data.customer.email || null,
    }
  } catch {
    return {
      shopifyCustomerId: null,
      shopifyCustomerGid: null,
      email: null,
    }
  }
}

export const getRechargeCustomerForShopifyCustomer = async (
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
    const url =
      `${RECHARGE_API_URL}/customers` +
      `?shopify_customer_id=${encodeURIComponent(idParam)}`

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

    const url =
      `${RECHARGE_API_URL}/customers` + `?email=${encodeURIComponent(email)}`

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
