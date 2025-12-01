'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { QuizStep } from '@/types/enums/constants'
import { getQuizStepPath } from '@/utils/quizRoutes'

export default function QuizPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(getQuizStepPath(QuizStep.Welcome))
  }, [router])

  return null
}
