import { randomBytes, createHash } from 'crypto'

export const generateCodeVerifier = (): string =>
  randomBytes(32).toString('base64url')

export const generateCodeChallenge = (verifier: string): string =>
  createHash('sha256').update(verifier).digest('base64url')

export const generateState = (): string => randomBytes(16).toString('base64url')

export const generateNonce = (): string => randomBytes(16).toString('base64url')

export const getClientId = (): string => {
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID?.trim()
  if (!clientId) {
    throw new Error('SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID is not set')
  }
  return clientId
}

interface OpenIDConfiguration {
  authorization_endpoint: string
  token_endpoint: string
  end_session_endpoint: string
  userinfo_endpoint: string
  issuer: string
}

let cachedConfig: OpenIDConfiguration | null = null
let cacheExpiry = 0

const CACHE_TTL_MS = 3600000 // 1 hour

export const discoverOpenIDConfig = async (): Promise<OpenIDConfiguration> => {
  if (cachedConfig && Date.now() < cacheExpiry) {
    return cachedConfig
  }
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim()
  if (!domain) {
    throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not set')
  }
  const res = await fetch(`https://${domain}/.well-known/openid-configuration`)
  if (!res.ok) {
    throw new Error('Failed to discover OpenID configuration')
  }
  cachedConfig = await res.json()
  cacheExpiry = Date.now() + CACHE_TTL_MS
  return cachedConfig!
}
