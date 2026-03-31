import { NextRequest, NextResponse } from 'next/server'

import { Cookies } from '@/types/enums/cookies'
import {
  discoverOpenIDConfig,
  generateCodeChallenge,
  generateCodeVerifier,
  generateNonce,
  generateState,
  getClientId,
} from '@/utils/auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const config = await discoverOpenIDConfig()

    const codeVerifier = generateCodeVerifier()
    const codeChallenge = generateCodeChallenge(codeVerifier)
    const state = generateState()
    const nonce = generateNonce()

    const origin = new URL(request.url).origin
    const redirectUri = `${origin}/api/auth/callback`

    const clientId = getClientId()

    const authUrl = new URL(config.authorization_endpoint)
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', 'openid email customer-account-api:full')
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('nonce', nonce)
    authUrl.searchParams.set('code_challenge', codeChallenge)
    authUrl.searchParams.set('code_challenge_method', 'S256')

    const pkceData = JSON.stringify({
      code_verifier: codeVerifier,
      state,
      nonce,
    })

    const response = NextResponse.redirect(authUrl.toString())

    response.cookies.set(Cookies.authPkce, pkceData, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 300,
    })

    return response
  } catch (error) {
    console.error('Login route error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate login' },
      { status: 500 }
    )
  }
}
