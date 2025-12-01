'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { QuizHeader } from '@/components/quiz/QuizHeader'
import { QuizStep } from '@/types/enums/constants'
import { cn } from '@/utils/cn'
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
    breed: z.string().optional(),
    bodyShape: z.string().optional(),
  })

export type QuizFormData = z.infer<ReturnType<typeof createQuizFormSchema>>

const QUIZ_FORM_STORAGE_KEY = 'quiz-form-data'

const getStoredFormData = (): Partial<QuizFormData> | null => {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    const stored = window.localStorage.getItem(QUIZ_FORM_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const saveFormData = (data: Partial<QuizFormData>) => {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(QUIZ_FORM_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore localStorage errors
  }
}

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

  const [isHydrated, setIsHydrated] = useState(false)
  const [storedFormData, setStoredFormData] =
    useState<Partial<QuizFormData> | null>(null)

  const defaultValues = useMemo(
    () => ({
      name: storedFormData?.name || '',
      gender: (storedFormData?.gender as 'male' | 'female') || 'male',
      age: storedFormData?.age || '',
      weight: storedFormData?.weight || '',
      neuteredStatus: storedFormData?.neuteredStatus,
      breed: storedFormData?.breed,
      bodyShape: storedFormData?.bodyShape,
    }),
    [storedFormData]
  )

  const formMethods = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  // Load stored values on mount after hydration
  useEffect(() => {
    setIsHydrated(true)
    const stored = getStoredFormData()
    setStoredFormData(stored)
    if (stored) {
      formMethods.reset({
        name: stored.name || '',
        gender: (stored.gender as 'male' | 'female') || 'male',
        age: stored.age || '',
        weight: stored.weight || '',
        neuteredStatus: stored.neuteredStatus,
        breed: stored.breed,
        bodyShape: stored.bodyShape,
      })
    }
  }, [formMethods])

  // Save form values to localStorage whenever they change
  useEffect(() => {
    if (!isHydrated) {
      return
    }
    const subscription = formMethods.watch((value) => {
      saveFormData(value)
    })
    return () => subscription.unsubscribe()
  }, [formMethods, isHydrated])

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
    <div className="flex flex-col h-screen bg-neutral-300 w-full overflow-y-auto">
      <div className="shrink-0 py-10 px-5 md:px-24">
        <QuizHeader visitedSteps={visitedSteps} />
      </div>

      <main
        className={cn('flex-1 flex mx-auto items-center justify-center px-0', {
          'max-w-2xl': currentStep !== QuizStep.Step5,
        })}
      >
        <div className="w-full py-8">{renderedStep}</div>
      </main>
    </div>
  )
}

export default QuizLayout
