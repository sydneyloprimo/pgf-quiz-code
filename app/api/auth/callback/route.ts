import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { Cookies } from '@/types/enums/cookies'
import { discoverOpenIDConfig, getClientId } from '@/utils/auth'

export const runtime = 'nodejs'

const ERROR_REDIRECT = '/auth/sign-in?error=auth_failed'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const origin = new URL(request.url).origin

  if (!code || !state) {
    return NextResponse.redirect(`${origin}${ERROR_REDIRECT}`)
  }

  const cookieStore = await cookies()
  const pkceCookie = cookieStore.get(Cookies.authPkce)?.value

  if (!pkceCookie) {
    return NextResponse.redirect(`${origin}${ERROR_REDIRECT}`)
  }

  let pkceData: {
    code_verifier: string
    state: string
    nonce: string
  }

  try {
    pkceData = JSON.parse(pkceCookie)
  } catch {
    return NextResponse.redirect(`${origin}${ERROR_REDIRECT}`)
  }

  if (pkceData.state !== state) {
    return NextResponse.redirect(`${origin}${ERROR_REDIRECT}`)
  }

  let config
  try {
    config = await discoverOpenIDConfig()
  } catch {
    return NextResponse.redirect(`${origin}${ERROR_REDIRECT}`)
  }

  const redirectUri = `${origin}/api/auth/callback`

  let clientId
  try {
    clientId = getClientId()
  } catch {
    return NextResponse.redirect(`${origin}${ERROR_REDIRECT}`)
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
    code_verifier: pkceData.code_verifier,
  })

  let tokenRes
  try {
    tokenRes = await fetch(config.token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })
  } catch {
    return NextResponse.redirect(`${origin}${ERROR_REDIRECT}`)
  }

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${origin}${ERROR_REDIRECT}`)
  }

  const tokens = await tokenRes.json()

  if (
    typeof tokens.access_token !== 'string' ||
    typeof tokens.refresh_token !== 'string'
  ) {
    return NextResponse.redirect(`${origin}${ERROR_REDIRECT}`)
  }

  // Validate nonce from ID token for OIDC compliance
  if (typeof tokens.id_token === 'string') {
    try {
      const payload = JSON.parse(globalThis.atob(tokens.id_token.split('.')[1]))
      if (payload.nonce !== pkceData.nonce) {
        return NextResponse.redirect(`${origin}${ERROR_REDIRECT}`)
      }
    } catch {
      return NextResponse.redirect(`${origin}${ERROR_REDIRECT}`)
    }
  }

  const response = NextResponse.redirect(`${origin}/`)

  response.cookies.set(Cookies.customerAccessToken, tokens.access_token, {
    path: '/',
    secure: true,
  })

  response.cookies.set(Cookies.authRefresh, tokens.refresh_token, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
  })

  response.cookies.set(Cookies.authPkce, '', {
    path: '/',
    maxAge: 0,
  })

  return response
}
