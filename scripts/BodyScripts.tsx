'use client'

import { Suspense } from 'react'

import { ClarityAnalytics } from './ClarityAnalytics'

const BodyScripts = () => (
  <Suspense>
    <ClarityAnalytics />
  </Suspense>
)

export default BodyScripts
