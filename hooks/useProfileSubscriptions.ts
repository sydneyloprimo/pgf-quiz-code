import { useCallback, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

import { Cookies } from '@/types/enums/cookies'

interface Pet {
  id: string
  name: string
  subscriptionStatus: 'active' | 'expired'
  deliveryFrequency: string
  renewalDate?: string
  paymentStatus?: string
  productTitle: string
  shopifyVariantId: number
  orderIntervalFrequency: number
  orderIntervalUnit: string
}

interface EditSubscriptionPayload {
  shopifyVariantId: string
  orderIntervalFrequency: string
  orderIntervalUnit: string
}

interface UseProfileSubscriptionsReturn {
  pets: Pet[]
  isLoading: boolean
  isError: boolean
  refetch: () => Promise<void>
  cancelSubscription: (
    subscriptionId: string
  ) => Promise<{ success: boolean; error?: string }>
  reactivateSubscription: (
    subscriptionId: string
  ) => Promise<{ success: boolean; error?: string }>
  editSubscription: (
    subscriptionId: string,
    payload: EditSubscriptionPayload
  ) => Promise<{ success: boolean; error?: string }>
  isCancelling: boolean
  isReactivating: boolean
  isEditing: boolean
}

export const useProfileSubscriptions = (): UseProfileSubscriptionsReturn => {
  const [cookies] = useCookies([Cookies.customerAccessToken])
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isReactivating, setIsReactivating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const customerAccessToken = isMounted
    ? cookies[Cookies.customerAccessToken]
    : null

  const fetchSubscriptions = useCallback(
    async (background = false) => {
      if (!isMounted) {
        return
      }

      if (!customerAccessToken) {
        setPets([])
        setIsLoading(false)
        return
      }

      if (!background) {
        setIsLoading(true)
        setIsError(false)
      }

      try {
        const response = await fetch('/api/profile/subscriptions', {
          cache: 'no-store',
          headers: {
            Authorization: `Bearer ${customerAccessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch subscriptions')
        }

        const data = await response.json()
        setPets(data.pets || [])
      } catch {
        if (!background) {
          setIsError(true)
        }
        setPets([])
      } finally {
        if (!background) {
          setIsLoading(false)
        }
      }
    },
    [isMounted, customerAccessToken]
  )

  useEffect(() => {
    if (isMounted) {
      fetchSubscriptions()
    }
  }, [isMounted, fetchSubscriptions])

  const cancelSubscription = useCallback(
    async (
      subscriptionId: string
    ): Promise<{ success: boolean; error?: string }> => {
      if (!customerAccessToken) {
        return { success: false, error: 'UNAUTHORIZED' }
      }

      setIsCancelling(true)

      try {
        const response = await fetch('/api/profile/subscriptions/cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${customerAccessToken}`,
          },
          body: JSON.stringify({ subscriptionId }),
        })

        const errorData = await response.json().catch(() => ({}))
        const knownCodes = new Set([
          'UNAUTHORIZED',
          'CANCELLATION_FAILED',
          'SUBSCRIPTION_ID_REQUIRED',
          'CUSTOMER_NOT_FOUND',
          'RECHARGE_CUSTOMER_NOT_FOUND',
          'SUBSCRIPTION_NOT_FOUND',
          'FORBIDDEN',
          'INTERNAL_SERVER_ERROR',
        ])
        const code = errorData.error
        const message = knownCodes.has(code)
          ? code
          : (errorData.details ?? code ?? 'CANCELLATION_FAILED')

        if (!response.ok) {
          return { success: false, error: message }
        }

        await fetchSubscriptions(true)
        return { success: true }
      } catch {
        return { success: false, error: 'INTERNAL_SERVER_ERROR' }
      } finally {
        setIsCancelling(false)
      }
    },
    [customerAccessToken, fetchSubscriptions]
  )

  const reactivateSubscription = useCallback(
    async (
      subscriptionId: string
    ): Promise<{ success: boolean; error?: string }> => {
      if (!customerAccessToken) {
        return { success: false, error: 'UNAUTHORIZED' }
      }

      setIsReactivating(true)

      try {
        const response = await fetch('/api/profile/subscriptions/reactivate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${customerAccessToken}`,
          },
          body: JSON.stringify({ subscriptionId }),
        })

        const errorData = await response.json().catch(() => ({}))
        const knownCodes = new Set([
          'UNAUTHORIZED',
          'REACTIVATION_FAILED',
          'SUBSCRIPTION_ID_REQUIRED',
          'CUSTOMER_NOT_FOUND',
          'RECHARGE_CUSTOMER_NOT_FOUND',
          'SUBSCRIPTION_NOT_FOUND',
          'FORBIDDEN',
          'INTERNAL_SERVER_ERROR',
        ])
        const code = errorData.error
        const message = knownCodes.has(code)
          ? code
          : (errorData.details ?? code ?? 'REACTIVATION_FAILED')

        if (!response.ok) {
          return { success: false, error: message }
        }

        await fetchSubscriptions(true)
        return { success: true }
      } catch {
        return { success: false, error: 'INTERNAL_SERVER_ERROR' }
      } finally {
        setIsReactivating(false)
      }
    },
    [customerAccessToken, fetchSubscriptions]
  )

  const editSubscription = useCallback(
    async (
      subscriptionId: string,
      payload: EditSubscriptionPayload
    ): Promise<{
      success: boolean
      error?: string
    }> => {
      if (!customerAccessToken) {
        return {
          success: false,
          error: 'UNAUTHORIZED',
        }
      }

      setIsEditing(true)

      try {
        const response = await fetch('/api/profile/subscriptions/edit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${customerAccessToken}`,
          },
          body: JSON.stringify({
            subscriptionId,
            ...payload,
          }),
        })

        const errorData = await response.json().catch(() => ({}))
        const knownCodes = new Set([
          'UNAUTHORIZED',
          'EDIT_FAILED',
          'SUBSCRIPTION_ID_REQUIRED',
          'INVALID_EDIT_PAYLOAD',
          'CUSTOMER_NOT_FOUND',
          'RECHARGE_CUSTOMER_NOT_FOUND',
          'SUBSCRIPTION_NOT_FOUND',
          'FORBIDDEN',
          'INTERNAL_SERVER_ERROR',
        ])
        const code = errorData.error
        const message = knownCodes.has(code)
          ? code
          : (errorData.details ?? code ?? 'EDIT_FAILED')

        if (!response.ok) {
          return { success: false, error: message }
        }

        await fetchSubscriptions(true)
        return { success: true }
      } catch {
        return {
          success: false,
          error: 'INTERNAL_SERVER_ERROR',
        }
      } finally {
        setIsEditing(false)
      }
    },
    [customerAccessToken, fetchSubscriptions]
  )

  return {
    pets,
    isLoading,
    isError,
    refetch: fetchSubscriptions,
    cancelSubscription,
    reactivateSubscription,
    editSubscription,
    isCancelling,
    isReactivating,
    isEditing,
  }
}
