'use client'
import { Suspense } from 'react'

import { ClarityAnalytics } from './ClarityAnalytics'

import { GoogleTagManager } from '@/scripts/GoogleTagManager'

const BodyScripts = () => (
  <>
    <Suspense>
      <ClarityAnalytics />
    </Suspense>
    <Suspense>
      <GoogleTagManager />
    </Suspense>
  </>
)

export default BodyScripts
