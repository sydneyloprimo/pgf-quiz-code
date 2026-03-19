'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Button } from '@/components/common/Button'
import { Link } from '@/components/common/Link'
import { cn } from '@/utils/cn'

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

interface SubscriptionPetRowProps {
  pet: Pet
  onCancelClick: (pet: Pet) => void
  onReactivateClick: (pet: Pet) => void
  onEditClick: (pet: Pet) => void
  t: ReturnType<typeof useTranslations<'Profile.PetsCard'>>
}

const getSubscriptionBadgeClasses = (
  subscriptionStatus: 'active' | 'expired'
) => {
  if (subscriptionStatus === 'active') {
    return 'bg-secondary-500 text-secondary-950'
  }
  return 'bg-neutral-white border border-neutral-900 text-neutral-900'
}

const getSubscriptionBadgeText = (
  subscriptionStatus: 'active' | 'expired',
  t: ReturnType<typeof useTranslations<'Profile.PetsCard'>>
) => {
  if (subscriptionStatus === 'active') {
    return t('activeSubscription')
  }
  return t('expiredSubscription')
}

const getActionButtonText = (
  subscriptionStatus: 'active' | 'expired',
  t: ReturnType<typeof useTranslations<'Profile.PetsCard'>>
) => {
  if (subscriptionStatus === 'active') {
    return t('editPlan')
  }
  return t('subscribeAgain')
}

const SubscriptionPetRow = ({
  pet,
  onCancelClick,
  onReactivateClick,
  onEditClick,
  t,
}: SubscriptionPetRowProps) => {
  const handleReactivateClick = useCallback(() => {
    onReactivateClick(pet)
  }, [pet, onReactivateClick])

  const handleEditClick = useCallback(() => {
    onEditClick(pet)
  }, [pet, onEditClick])

  const handleCancelLinkClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onCancelClick(pet)
    },
    [pet, onCancelClick]
  )

  return (
    <div className="bg-neutral-200 p-6 flex flex-col md:flex-row gap-3 md:items-center">
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex gap-3 items-center">
          <h3 className="heading-h5 text-secondary-950">{pet.name}</h3>
          <span
            className={cn(
              'px-3 py-1 rounded-2xxl text-xs font-bold',
              getSubscriptionBadgeClasses(pet.subscriptionStatus)
            )}
          >
            {getSubscriptionBadgeText(pet.subscriptionStatus, t)}
          </span>
        </div>
        <p className="text-sm text-neutral-black">
          {pet.deliveryFrequency}
          {pet.renewalDate && ` - ${t('renewsOn', { date: pet.renewalDate })}`}
        </p>
      </div>
      <div className="flex flex-col gap-3 md:items-center">
        <Button
          variant="tertiary"
          size="large"
          onClick={
            pet.subscriptionStatus === 'expired'
              ? handleReactivateClick
              : handleEditClick
          }
        >
          {getActionButtonText(pet.subscriptionStatus, t)}
        </Button>
        {pet.subscriptionStatus === 'active' ? (
          <Link
            href="#"
            onClick={handleCancelLinkClick}
            className="text-sm font-bold text-neutral-black cursor-pointer"
            aria-label={t('cancelSubscription')}
          >
            {t('cancelSubscription')}
          </Link>
        ) : pet.paymentStatus ? (
          <p className="text-sm font-bold text-neutral-black">
            {t('pendingPayment')}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export { SubscriptionPetRow }
