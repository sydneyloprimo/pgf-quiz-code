'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import {
  getPersonalData,
  getStoredFormData,
  parseQuizParamsFromUrl,
  saveFormData,
} from '@/components/quiz/helpers'
import {
  QuizDropdownProvider,
  useQuizDropdownContext,
} from '@/components/quiz/QuizDropdownContext'
import { QuizHeader } from '@/components/quiz/QuizHeader'
import { FEATURE_FLAG_WAITLIST, MAIN_CONTENT_ID } from '@/constants'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'
import { QuizStep } from '@/types/enums/constants'
import { Events } from '@/types/enums/events'
import { trackEvent, trackQuizStep } from '@/utils/analytics'
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
    age: z.string().min(1, t('validation.ageRequired')),
    weight: z
      .string()
      .min(1, t('validation.weightRequired'))
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: t('validation.weightMustBePositive'),
      }),
    neuteredStatus: z.enum(['neutered', 'intact']).optional(),
    breed: z.string().optional(),
    bodyShape: z.string().optional(),
    mainFood: z.string().optional(),
    treatFrequency: z.string().optional(),
    mealtimeBehavior: z.string().optional(),
    activityLevel: z.string().optional(),
    zipCode: z.string().optional(),
    subscriptionType: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.union([z.string().email(), z.literal('')]).optional(),
  })

export type QuizFormData = z.infer<ReturnType<typeof createQuizFormSchema>>

interface QuizLayoutProps {
  renderStep: (
    currentStep: QuizStep,
    goToStep: (step: QuizStep, track?: boolean) => void,
    goBack: () => void,
    canGoBack: boolean,
    formMethods: UseFormReturn<QuizFormData>
  ) => React.ReactNode
}

const QuizLayout = ({ renderStep }: QuizLayoutProps) => {
  const t = useTranslations('Quiz')
  const waitlistFlipEnabled = useFeatureFlag(FEATURE_FLAG_WAITLIST)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
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
      mainFood: storedFormData?.mainFood,
      treatFrequency: storedFormData?.treatFrequency,
      mealtimeBehavior: storedFormData?.mealtimeBehavior,
      activityLevel: storedFormData?.activityLevel,
      zipCode: storedFormData?.zipCode,
      subscriptionType: storedFormData?.subscriptionType,
      firstName: storedFormData?.firstName,
      lastName: storedFormData?.lastName,
      email: storedFormData?.email,
    }),
    [storedFormData]
  )

  const formMethods = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues,
    mode: 'onChange',
    shouldUnregister: false,
  })

  // Load stored values on mount after hydration
  useEffect(() => {
    setIsHydrated(true)
    const paramsData = parseQuizParamsFromUrl(searchParams)
    const stored = paramsData ?? getStoredFormData()
    const personalData = getPersonalData()
    if (paramsData) {
      saveFormData(paramsData)
    }
    setStoredFormData(stored)
    const merged = {
      name: stored?.name || '',
      gender: (stored?.gender as 'male' | 'female') || 'male',
      age: stored?.age || '',
      weight: stored?.weight || '',
      neuteredStatus: stored?.neuteredStatus,
      breed: stored?.breed,
      bodyShape: stored?.bodyShape,
      mainFood: stored?.mainFood,
      treatFrequency: stored?.treatFrequency,
      mealtimeBehavior: stored?.mealtimeBehavior,
      activityLevel: stored?.activityLevel,
      zipCode: stored?.zipCode ?? personalData?.zipCode ?? '',
      subscriptionType: stored?.subscriptionType,
      firstName: stored?.firstName ?? personalData?.firstName ?? '',
      lastName: stored?.lastName ?? personalData?.lastName ?? '',
      email: stored?.email ?? personalData?.email ?? '',
    }
    if (stored || personalData) {
      formMethods.reset(merged)
    }
  }, [formMethods, searchParams])

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
    (step: QuizStep, track = true) => {
      const {
        email: _email,
        firstName: _firstName,
        lastName: _lastName,
        name: _name,
        zipCode: _zipCode,
        ...quizResponses
      } = formMethods.getValues()
      if (track) {
        const isResultsStep =
          step === QuizStep.Results || step === QuizStep.ResultsBeta
        const stepIndex = isResultsStep
          ? STEP_ORDER.length + 1
          : getStepNumber(step)
        trackQuizStep(step, stepIndex, quizResponses)
        if (isResultsStep) {
          trackEvent(Events.quizComplete, quizResponses)
        }
      }
      router.push(getQuizStepPath(step))
    },
    [formMethods, router]
  )

  const goBack = useCallback(() => {
    // Special handling for error pages - they should always go back to PetInfo
    if (
      currentStep === QuizStep.Plus25Lbs ||
      currentStep === QuizStep.UnderAge
    ) {
      goToStep(QuizStep.PetInfo, false)
      return
    }

    // Results page: go back to SubscriptionType (flag ON) or Diet (flag OFF)
    if (currentStep === QuizStep.Results) {
      goToStep(
        waitlistFlipEnabled ? QuizStep.SubscriptionType : QuizStep.Step6,
        false
      )
      return
    }

    // ResultsBeta should go back to SubscriptionType
    if (currentStep === QuizStep.ResultsBeta) {
      goToStep(QuizStep.SubscriptionType, false)
      return
    }

    // ConfirmationBeta should go back to ResultsBeta
    if (currentStep === QuizStep.ConfirmationBeta) {
      goToStep(QuizStep.ResultsBeta, false)
      return
    }

    // For other steps, find the previous step in the logical flow
    const currentIndex = STEP_ORDER.indexOf(currentStep)
    if (currentIndex > 0) {
      const previousStep = STEP_ORDER[currentIndex - 1]
      goToStep(previousStep, false)
    } else {
      // Fallback to browser back if we can't determine previous step
      router.back()
    }
  }, [currentStep, goToStep, router, waitlistFlipEnabled])

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
    <QuizDropdownProvider>
      <QuizLayoutContent
        currentStep={currentStep}
        waitlistFlipEnabled={waitlistFlipEnabled}
        visitedSteps={visitedSteps}
        goBack={goBack}
        renderedStep={renderedStep}
      />
    </QuizDropdownProvider>
  )
}

const QuizLayoutContent = ({
  currentStep,
  waitlistFlipEnabled,
  visitedSteps,
  goBack,
  renderedStep,
}: {
  currentStep: QuizStep
  waitlistFlipEnabled: boolean
  visitedSteps: number
  goBack: () => void
  renderedStep: React.ReactNode
}) => {
  const { isDropdownOpen = false } = useQuizDropdownContext() ?? {}

  return (
    <div className="flex flex-col min-h-screen bg-neutral-300 text-secondary-950 w-full overflow-y-auto">
      <QuizHeader
        visitedSteps={visitedSteps}
        showProgressBar={
          currentStep !== QuizStep.Results &&
          currentStep !== QuizStep.ResultsBeta &&
          currentStep !== QuizStep.ConfirmationBeta
        }
        centerLogo={
          currentStep === QuizStep.Results ||
          currentStep === QuizStep.ResultsBeta ||
          currentStep === QuizStep.ConfirmationBeta
        }
        showBackButton={
          currentStep === QuizStep.Results ||
          currentStep === QuizStep.ResultsBeta
        }
        hideBackButtonOnMobile={currentStep === QuizStep.ResultsBeta}
        hideCloseButtonOnMobile={
          currentStep === QuizStep.ResultsBeta ||
          currentStep === QuizStep.ConfirmationBeta
        }
        onBack={goBack}
      />

      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className={cn(
          'flex-1 flex items-center justify-center',
          'w-full tablet:mx-auto',
          'px-10 tablet:px-0',
          {
            'tablet:max-w-2xl': currentStep !== QuizStep.Step5,
          }
        )}
      >
        <div className={cn('w-full', isDropdownOpen ? 'pb-20' : 'pb-8')}>
          {renderedStep}
        </div>
      </main>
    </div>
  )
}

export default QuizLayout
