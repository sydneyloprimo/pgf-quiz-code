'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { QuizHeader } from '@/components/quiz/QuizHeader'
import { QuizStep } from '@/types/enums/constants'
import {
  getQuizStepPath,
  getQuizStepFromPath,
  getStepNumber,
} from '@/utils/quizRoutes'

export const quizFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  gender: z.enum(['male', 'female']),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Age must be a positive number',
    }),
  weight: z
    .string()
    .min(1, 'Weight is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Weight must be a positive number',
    }),
  neuteredStatus: z.enum(['neutered', 'intact']).optional(),
})

export type QuizFormData = z.infer<typeof quizFormSchema>

interface QuizLayoutProps {
  renderStep: (
    currentStep: QuizStep,
    goToStep: (step: QuizStep) => void,
    goBack: () => void,
    canGoBack: boolean,
    formMethods: UseFormReturn<QuizFormData>
  ) => React.ReactNode
}

const QuizLayout = ({ renderStep }: QuizLayoutProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [currentStep, setCurrentStep] = useState<QuizStep>(QuizStep.Welcome)
  const [isInitialized, setIsInitialized] = useState(false)

  const formMethods = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      name: '',
      gender: 'male',
      age: '',
      weight: '',
      neuteredStatus: undefined,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const stepFromPath = getQuizStepFromPath(pathname)
    if (stepFromPath) {
      setCurrentStep(stepFromPath)
    }
    setIsInitialized(true)
  }, [pathname])

  useEffect(() => {
    if (!isInitialized) return

    const stepFromPath = getQuizStepFromPath(pathname)
    if (stepFromPath && stepFromPath !== currentStep) {
      setCurrentStep(stepFromPath)
    }
  }, [pathname, currentStep, isInitialized])

  const goToStep = useCallback(
    (step: QuizStep) => {
      setCurrentStep(step)
      router.push(getQuizStepPath(step))
    },
    [router]
  )

  const goBack = useCallback(() => {
    router.back()
  }, [router])

  const canGoBack = currentStep !== QuizStep.Welcome
  const visitedSteps = getStepNumber(currentStep)

  return (
    <div className="flex flex-col min-h-screen bg-neutral-300 w-full py-10 px-5 md:px-24">
      <QuizHeader visitedSteps={visitedSteps} />

      <main className="flex-1 flex items-center justify-center px-0">
        {renderStep(currentStep, goToStep, goBack, canGoBack, formMethods)}
      </main>
    </div>
  )
}

export default QuizLayout
