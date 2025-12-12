'use client'

import { useCallback, useState } from 'react'

export type EmailCustomerErrorCode =
  | 'EMAIL_REQUIRED'
  | 'INVALID_EMAIL'
  | 'EMAIL_ALREADY_EXISTS'
  | 'CUSTOMER_CREATION_FAILED'
  | 'SERVER_CONFIGURATION_ERROR'
  | 'INTERNAL_SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNEXPECTED_RESPONSE'

interface CreateEmailCustomerResponse {
  customerId?: number
  email?: string
  error?: EmailCustomerErrorCode
}

interface UseEmailCustomerReturn {
  createEmailCustomer: (email: string) => Promise<CreateEmailCustomerResponse>
  isLoading: boolean
  error: EmailCustomerErrorCode | null
  customerId: number | null
  clearError: () => void
  reset: () => void
}

export const useEmailCustomer = (
  onSuccess?: (customerId: number, email: string) => void
): UseEmailCustomerReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<EmailCustomerErrorCode | null>(null)
  const [customerId, setCustomerId] = useState<number | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setCustomerId(null)
    setIsLoading(false)
  }, [])

  const createEmailCustomer = useCallback(
    async (email: string): Promise<CreateEmailCustomerResponse> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        const data: CreateEmailCustomerResponse = await response.json()

        if (!response.ok || data.error) {
          const errorCode = data.error || 'UNEXPECTED_RESPONSE'
          setError(errorCode)
          setIsLoading(false)
          return { error: errorCode }
        }

        if (data.customerId && data.email) {
          setCustomerId(data.customerId)
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
    createEmailCustomer,
    isLoading,
    error,
    customerId,
    clearError,
    reset,
  }
}
