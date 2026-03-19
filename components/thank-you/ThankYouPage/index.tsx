'use client'

import { useEffect, useRef, useState } from 'react'

import { ThankYouContent } from './ThankYouContent'

import { clearFormData, getStoredFormData } from '@/components/quiz/helpers'
import { QuizHeader } from '@/components/quiz/QuizHeader'
import { MAIN_CONTENT_ID, TOTAL_QUIZ_STEPS } from '@/constants'

const readDogName = (): string => {
  const formData = getStoredFormData()
  return formData?.name || ''
}

const ThankYouPage = () => {
  const [dogName] = useState(readDogName)
  const hasCleared = useRef(false)

  useEffect(() => {
    if (hasCleared.current) {
      return
    }
    hasCleared.current = true
    clearFormData()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-neutral-300 w-full overflow-y-auto">
      <QuizHeader visitedSteps={TOTAL_QUIZ_STEPS} showProgressBar />
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className="flex-1 flex items-center justify-center w-full px-5 lg:px-0"
      >
        <ThankYouContent dogName={dogName} />
      </main>
    </div>
  )
}

export { ThankYouPage }
