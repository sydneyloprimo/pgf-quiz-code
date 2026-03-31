import { NextRequest, NextResponse } from 'next/server'

import { Cookies } from '@/types/enums/cookies'
import { discoverOpenIDConfig } from '@/utils/auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin

  let logoutUrl: string | null = null
  try {
    const config = await discoverOpenIDConfig()
    if (config.end_session_endpoint) {
      const url = new URL(config.end_session_endpoint)
      url.searchParams.set('post_logout_redirect_uri', origin)
      logoutUrl = url.toString()
    }
  } catch {
    // Discovery failed; fall through to
    // redirect home
  }

  const redirectTo = logoutUrl || `${origin}/`
  const response = NextResponse.redirect(redirectTo)

  response.cookies.set(Cookies.customerAccessToken, '', {
    path: '/',
    secure: true,
    maxAge: 0,
  })

  response.cookies.set(Cookies.authRefresh, '', {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
  })

  response.cookies.set(Cookies.cart, '', {
    path: '/',
    maxAge: 0,
  })

  return response
}
