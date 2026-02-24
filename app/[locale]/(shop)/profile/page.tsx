'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

import { Button } from '@/components/common/Button'
import Spinner from '@/components/common/Spinner'
import { DeleteAccountModal } from '@/components/profile/DeleteAccountModal'
import { OrdersCard } from '@/components/profile/OrdersCard'
import { PetsCard } from '@/components/profile/PetsCard'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { useModal } from '@/hooks/useModal'
import { useProfileSubscriptions } from '@/hooks/useProfileSubscriptions'
import { client } from '@/shopify/client'
import { useGetOrdersQuery } from '@/shopify/generated/graphql'
import { Cookies } from '@/types/enums/cookies'
import { Routes } from '@/types/enums/routes'

export default function ProfilePage() {
  const t = useTranslations('Profile')
  const router = useRouter()
  const [cookies] = useCookies([Cookies.customerAccessToken])
  const [isMounted, setIsMounted] = useState(false)
  const {
    isOpen: isDeleteAccountModalOpen,
    openModal: openDeleteAccountModal,
    closeModal: closeDeleteAccountModal,
  } = useModal()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const customerAccessToken = isMounted
    ? cookies[Cookies.customerAccessToken]
    : null

  useEffect(() => {
    if (isMounted && !customerAccessToken) {
      router.push(Routes.signin)
    }
  }, [isMounted, customerAccessToken, router])

  const { data, isLoading, isError } = useGetOrdersQuery(
    client,
    {
      customerAccessToken: customerAccessToken || '',
      first: 20,
    },
    {
      enabled: !!customerAccessToken,
    }
  )

  const {
    pets,
    isLoading: isLoadingPets,
    cancelSubscription,
    reactivateSubscription,
  } = useProfileSubscriptions()

  const handleDeleteAccount = useCallback(() => {
    // TODO: Implement delete account logic
    closeDeleteAccountModal()
  }, [closeDeleteAccountModal])

  const handleCancelSubscription = useCallback(
    (subscriptionId: string) => cancelSubscription(subscriptionId),
    [cancelSubscription]
  )

  const handleReactivateSubscription = useCallback(
    (subscriptionId: string) => reactivateSubscription(subscriptionId),
    [reactivateSubscription]
  )

  const orders = data?.customer?.orders?.edges || []

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!customerAccessToken) {
    return null
  }

  if (isLoading || isLoadingPets) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 md:gap-12 px-5 md:px-11 py-6 md:py-12">
      <ProfileHeader />
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8 flex-1">
        <div className="flex-1">
          <PetsCard
            pets={pets}
            onCancelSubscription={handleCancelSubscription}
            onReactivateSubscription={handleReactivateSubscription}
          />
        </div>
        <div className="flex-1">
          <OrdersCard orders={orders} />
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="large"
          onClick={openDeleteAccountModal}
          className="text-feedback-error-500 hover:text-feedback-error-600 active:text-feedback-error-700 focus:text-feedback-error-500 focus:border-feedback-error-500"
        >
          {t('deleteAccountLink.text')}
        </Button>
      </div>
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={closeDeleteAccountModal}
        onConfirm={handleDeleteAccount}
      />
    </div>
  )
}
