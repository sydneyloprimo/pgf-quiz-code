'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
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

  // Single source of truth: derive currentStep from pathname
  const currentStep = useMemo(() => {
    const stepFromPath = getQuizStepFromPath(pathname)
    return stepFromPath || QuizStep.Welcome
  }, [pathname])

  const goToStep = useCallback(
    (step: QuizStep) => {
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

  const canGoBack = useMemo(
    () => currentStep !== QuizStep.Welcome,
    [currentStep]
  )
  const visitedSteps = useMemo(() => getStepNumber(currentStep), [currentStep])

  // Memoize the rendered step to prevent unnecessary re-renders
  const renderedStep = useMemo(
    () => renderStep(currentStep, goToStep, goBack, canGoBack, formMethods),
    [currentStep, goToStep, goBack, canGoBack, formMethods, renderStep]
  )

  return (
    <div className="flex flex-col min-h-screen bg-neutral-300 w-full py-10 px-5 md:px-24">
      <QuizHeader visitedSteps={visitedSteps} />

      <main className="flex-1 flex max-w-2xl mx-auto items-center justify-center px-0">
        {renderedStep}
      </main>
    </div>
  )
}

export default QuizLayout
