import { client } from '@/shopify/client'
import { GetCustomerDocument } from '@/shopify/generated/graphql'

export function getAdminUrl(): string | null {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const version = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION
  if (!domain || !version) return null
  return `https://${domain}/admin/api/${version}/graphql.json`
}

export async function resolveCustomerGid(
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
