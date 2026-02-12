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
}

interface UseProfileSubscriptionsReturn {
  pets: Pet[]
  isLoading: boolean
  isError: boolean
  refetch: () => Promise<void>
  cancelSubscription: (subscriptionId: string) => Promise<boolean>
  reactivateSubscription: (
    subscriptionId: string
  ) => Promise<{ success: boolean; error?: string }>
  isCancelling: boolean
  isReactivating: boolean
}

export const useProfileSubscriptions = (): UseProfileSubscriptionsReturn => {
  const [cookies] = useCookies([Cookies.customerAccessToken])
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isReactivating, setIsReactivating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const customerAccessToken = isMounted
    ? cookies[Cookies.customerAccessToken]
    : null

  const fetchSubscriptions = useCallback(async () => {
    if (!isMounted) {
      return
    }

    if (!customerAccessToken) {
      setPets([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setIsError(false)

    try {
      const response = await fetch('/api/profile/subscriptions', {
        headers: {
          Authorization: `Bearer ${customerAccessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions')
      }

      const data = await response.json()
      setPets(data.pets || [])
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      setIsError(true)
      setPets([])
    } finally {
      setIsLoading(false)
    }
  }, [isMounted, customerAccessToken])

  useEffect(() => {
    if (isMounted) {
      fetchSubscriptions()
    }
  }, [isMounted, fetchSubscriptions])

  const cancelSubscription = useCallback(
    async (subscriptionId: string): Promise<boolean> => {
      if (!customerAccessToken) {
        return false
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

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to cancel subscription')
        }

        await fetchSubscriptions()
        return true
      } catch (error) {
        console.error('Error cancelling subscription:', error)
        return false
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
        return { success: false, error: 'Not authenticated' }
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
        const message =
          errorData.details ?? errorData.error ?? 'Failed to reactivate'

        if (!response.ok) {
          return { success: false, error: message }
        }

        await fetchSubscriptions()
        return { success: true }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to reactivate'
        console.error('Error reactivating subscription:', error)
        return { success: false, error: message }
      } finally {
        setIsReactivating(false)
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
    isCancelling,
    isReactivating,
  }
}
