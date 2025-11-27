'use client'

import { PropsWithChildren } from 'react'

import { QuizHeader } from '@/components/quiz/QuizHeader'

interface QuizLayoutProps extends PropsWithChildren {
  stepNumber: number
}

const QuizLayout = ({ children, stepNumber }: QuizLayoutProps) => {
  const TOTAL_STEPS = 8

  return (
    <div className="flex flex-col min-h-screen bg-neutral-300 w-full py-10 px-5 md:px-24">
      <QuizHeader currentStep={stepNumber} totalSteps={TOTAL_STEPS} />

      <main className="flex-1 flex items-center justify-center px-0">
        {children}
      </main>
    </div>
  )
}

export default QuizLayout
