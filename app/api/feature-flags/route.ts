import { NextRequest, NextResponse } from 'next/server'

import { getFeatureFlag } from '@/contentful/featureFlags'

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (!key) {
    return NextResponse.json({ error: 'key is required' }, { status: 400 })
  }

  try {
    const enabled = await getFeatureFlag(key)
    return NextResponse.json({ key, enabled })
  } catch (error) {
    console.error('Feature flag fetch error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    )
  }
}
