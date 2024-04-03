'use client'
import { Suspense } from 'react'

import { ClarityAnalytics } from './ClarityAnalytics'

const HeadScripts = () => (
  <>
    <Suspense>
      <ClarityAnalytics />
    </Suspense>
  </>
)

export default HeadScripts
