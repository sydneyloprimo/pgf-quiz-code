'use client'

import { useState } from 'react'

import QuizLayout from '@/components/quiz/QuizLayout'

export default function QuizPage() {
  const [stepNumber, setStepNumber] = useState(1)
  const [answers, setAnswers] = useState<Record<number, unknown>>({})

  const handleNext = () => {
    setStepNumber((prev) => prev + 1)
  }

  const handleBack = () => {
    setStepNumber((prev) => Math.max(1, prev - 1))
  }

  return (
    <QuizLayout stepNumber={stepNumber} onNext={handleNext} onBack={handleBack}>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p>Step number: {stepNumber}</p>
      </div>
    </QuizLayout>
  )
}
