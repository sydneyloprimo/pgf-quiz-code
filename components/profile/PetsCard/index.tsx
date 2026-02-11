'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useId, useState } from 'react'

import { Button } from '@/components/common/Button'
import { ChevronIcon } from '@/components/common/Icon'
import { Link } from '@/components/common/Link'
import { CancelSubscriptionModal } from '@/components/profile/CancelSubscriptionModal'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { useModal } from '@/hooks/useModal'
import { cn } from '@/utils/cn'

interface Pet {
  id: string
  name: string
  subscriptionStatus: 'active' | 'expired'
  deliveryFrequency: string
  renewalDate?: string
  paymentStatus?: string
}

interface PetsCardProps {
  pets?: Pet[]
  onCancelSubscription?: (subscriptionId: string) => void
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

const PetsCard = ({ pets = [], onCancelSubscription }: PetsCardProps) => {
  const t = useTranslations('Profile.PetsCard')
  const [isOpen, setIsOpen] = useState(true)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const contentId = useId()
  const {
    isOpen: isCancelModalOpen,
    openModal: openCancelModal,
    closeModal: closeCancelModal,
  } = useModal()

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleCancelClick = useCallback(
    (pet: Pet) => {
      setSelectedPet(pet)
      openCancelModal()
    },
    [openCancelModal]
  )

  const handleConfirmCancel = useCallback(() => {
    if (selectedPet && onCancelSubscription) {
      onCancelSubscription(selectedPet.id)
      setSelectedPet(null)
    }
  }, [selectedPet, onCancelSubscription])

  return (
    <ProfileCard className="w-full bg-neutral-white border border-quaternary-800 p-6 flex flex-col gap-8">
      <button
        type="button"
        onClick={handleToggle}
        className="flex gap-3 items-start text-left"
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-label={t('title')}
      >
        <div className="flex flex-col gap-3 flex-1">
          <h2 className="heading-h5 text-secondary-950">{t('title')}</h2>
          <p className="text-body-m text-secondary-950">{t('description')}</p>
        </div>
        <ChevronIcon
          direction={isOpen ? 'up' : 'down'}
          className="size-6 text-secondary-950 shrink-0 cursor-pointer"
        />
      </button>
      {isOpen && (
        <div id={contentId} className="flex flex-col gap-6">
          {pets.length === 0 ? (
            <p className="text-body-m text-secondary-950">{t('emptyState')}</p>
          ) : (
            pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-neutral-200 p-6 flex flex-col md:flex-row gap-3 md:items-center"
              >
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex gap-3 items-center">
                    <h3 className="heading-h5 text-secondary-950">
                      {pet.name}
                    </h3>
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
                    {pet.renewalDate &&
                      ` - ${t('renewsOn', { date: pet.renewalDate })}`}
                  </p>
                </div>
                <div className="flex flex-col gap-3 md:items-center">
                  <Button variant="tertiary" size="large">
                    {getActionButtonText(pet.subscriptionStatus, t)}
                  </Button>
                  {pet.subscriptionStatus === 'active' ? (
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handleCancelClick(pet)
                      }}
                      className="text-sm font-bold text-neutral-black cursor-pointer"
                      aria-label={t('cancelSubscription')}
                    >
                      {t('cancelSubscription')}
                    </Link>
                  ) : pet.paymentStatus ? (
                    <p className="text-sm font-bold text-neutral-black">
                      {pet.paymentStatus}
                    </p>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {selectedPet && (
        <CancelSubscriptionModal
          isOpen={isCancelModalOpen}
          onClose={closeCancelModal}
          onConfirm={handleConfirmCancel}
          petName={selectedPet.name}
        />
      )}
    </ProfileCard>
  )
}

export { PetsCard }
