'use client'
import { Suspense } from 'react'

import { GoogleTagManager } from '@/scripts/GoogleTagManager'

const BodyScripts = () => (
  <>
    <Suspense>
      <GoogleTagManager />
    </Suspense>
  </>
)

export default BodyScripts
