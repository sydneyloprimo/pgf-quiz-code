import { NextRequest, NextResponse } from 'next/server'

import { getQuizBreedOptions } from '@/contentful/quiz'

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') ?? 'en'
  const options = await getQuizBreedOptions(locale)
  return NextResponse.json({ options })
}
