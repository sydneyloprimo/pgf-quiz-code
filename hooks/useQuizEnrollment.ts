'use client'

import { useCallback, useState } from 'react'

import {
  buildQuizResultsUrl,
  calculateDailyFoodAndPrice,
  formatQuizFormDataAsNote,
} from '@/components/quiz/helpers'
import type { QuizFormData } from '@/components/quiz/QuizLayout'
import {
  QUIZ_ENROLLMENT_TAGS,
  QUIZ_PACK_CALCULATION_DEFAULTS,
  QUIZ_RESULTS_NOTE_LABEL,
} from '@/constants'
import { calculateWeeklyPacks } from '@/utils/cartHelpers'

export type QuizEnrollmentErrorCode =
  | 'EMAIL_REQUIRED'
  | 'FIRST_NAME_REQUIRED'
  | 'LAST_NAME_REQUIRED'
  | 'INVALID_EMAIL'
  | 'EMAIL_ALREADY_EXISTS'
  | 'CUSTOMER_CREATION_FAILED'
  | 'SERVER_CONFIGURATION_ERROR'
  | 'INTERNAL_SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNEXPECTED_RESPONSE'

interface QuizEnrollmentResponse {
  customerId?: number
  email?: string
  error?: QuizEnrollmentErrorCode
}

interface UseQuizEnrollmentReturn {
  submitQuizEnrollment: (
    formData: Partial<QuizFormData>
  ) => Promise<QuizEnrollmentResponse>
  isLoading: boolean
  error: QuizEnrollmentErrorCode | null
  clearError: () => void
  reset: () => void
}

export const useQuizEnrollment = (
  onSuccess?: (customerId: number, email: string) => void
): UseQuizEnrollmentReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<QuizEnrollmentErrorCode | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setIsLoading(false)
  }, [])

  const submitQuizEnrollment = useCallback(
    async (
      formData: Partial<QuizFormData>
    ): Promise<QuizEnrollmentResponse> => {
      const firstName = formData.firstName?.trim()
      const lastName = formData.lastName?.trim()
      const email = formData.email?.trim()

      if (!firstName) {
        setError('FIRST_NAME_REQUIRED')
        return { error: 'FIRST_NAME_REQUIRED' }
      }
      if (!lastName) {
        setError('LAST_NAME_REQUIRED')
        return { error: 'LAST_NAME_REQUIRED' }
      }
      if (!email) {
        setError('EMAIL_REQUIRED')
        return { error: 'EMAIL_REQUIRED' }
      }

      setIsLoading(true)
      setError(null)

      try {
        const { dailyFoodGrams } = calculateDailyFoodAndPrice(
          formData as QuizFormData,
          QUIZ_PACK_CALCULATION_DEFAULTS.recipe,
          QUIZ_PACK_CALCULATION_DEFAULTS.mode
        )
        const packs = calculateWeeklyPacks(dailyFoodGrams)
        const resultsUrl = buildQuizResultsUrl(formData, packs)
        const formattedNote = formatQuizFormDataAsNote(formData)
        const note = resultsUrl
          ? `${formattedNote}\n${QUIZ_RESULTS_NOTE_LABEL}: ${resultsUrl}`
          : formattedNote
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            firstName,
            lastName,
            note,
            tags: [...QUIZ_ENROLLMENT_TAGS],
          }),
        })

        const data: QuizEnrollmentResponse = await response.json()

        if (!response.ok || data.error) {
          const errorCode = data.error || 'UNEXPECTED_RESPONSE'
          setError(errorCode)
          setIsLoading(false)
          return { error: errorCode }
        }

        if (data.customerId && data.email) {
          setIsLoading(false)
          onSuccess?.(data.customerId, data.email)
          return { customerId: data.customerId, email: data.email }
        }

        setError('UNEXPECTED_RESPONSE')
        setIsLoading(false)
        return { error: 'UNEXPECTED_RESPONSE' }
      } catch {
        setError('NETWORK_ERROR')
        setIsLoading(false)
        return { error: 'NETWORK_ERROR' }
      }
    },
    [onSuccess]
  )

  return {
    submitQuizEnrollment,
    isLoading,
    error,
    clearError,
    reset,
  }
}
