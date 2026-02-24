import { NextResponse } from 'next/server'

import {
  getContentfulImageMap,
  getContentfulImageMapDiagnostic,
} from '@/contentful/images'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const map = await getContentfulImageMap()
    const count = Object.keys(map).length
    const body: Record<string, unknown> = { ...map }
    if (count === 0) {
      const diagnostic = await getContentfulImageMapDiagnostic()
      body._debug = diagnostic
    }
    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Contentful-Image-Map-Count': String(count),
      },
    })
  } catch (err) {
    console.error('Contentful image map error:', err)
    return NextResponse.json({}, { status: 500 })
  }
}
