'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { QuizHeader } from '@/components/quiz/QuizHeader'
import { QuizStep } from '@/types/enums/constants'
import {
  getQuizStepPath,
  getQuizStepFromPath,
  getStepNumber,
  STEP_ORDER,
} from '@/utils/quizRoutes'

const createQuizFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    gender: z.enum(['male', 'female']),
    age: z
      .string()
      .min(1, t('validation.ageRequired'))
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: t('validation.ageMustBePositive'),
      }),
    weight: z
      .string()
      .min(1, t('validation.weightRequired'))
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: t('validation.weightMustBePositive'),
      }),
    neuteredStatus: z.enum(['neutered', 'intact']).optional(),
  })

export type QuizFormData = z.infer<ReturnType<typeof createQuizFormSchema>>

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
  const t = useTranslations('Quiz')
  const router = useRouter()
  const pathname = usePathname()
  const [currentStep, setCurrentStep] = useState<QuizStep>(QuizStep.Welcome)
  const [isInitialized, setIsInitialized] = useState(false)

  const quizFormSchema = useMemo(() => createQuizFormSchema(t), [t])

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
    // Special handling for error pages - they should always go back to PetInfo
    if (
      currentStep === QuizStep.Plus25Lbs ||
      currentStep === QuizStep.UnderAge
    ) {
      goToStep(QuizStep.PetInfo)
      return
    }

    // For other steps, find the previous step in the logical flow
    const currentIndex = STEP_ORDER.indexOf(currentStep)
    if (currentIndex > 0) {
      const previousStep = STEP_ORDER[currentIndex - 1]
      goToStep(previousStep)
    } else {
      // Fallback to browser back if we can't determine previous step
      router.back()
    }
  }, [currentStep, goToStep, router])

  const canGoBack = currentStep !== QuizStep.Welcome
  const visitedSteps = getStepNumber(currentStep)

  return (
    <div className="flex flex-col min-h-screen bg-neutral-300 w-full py-10 px-5 md:px-24">
      <QuizHeader visitedSteps={visitedSteps} />

      <main className="flex-1 flex max-w-2xl mx-auto items-center justify-center px-0">
        {renderStep(currentStep, goToStep, goBack, canGoBack, formMethods)}
      </main>
    </div>
  )
}

export default QuizLayout
