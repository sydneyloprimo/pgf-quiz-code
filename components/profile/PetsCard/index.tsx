'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useId, useState } from 'react'

import { ChevronIcon } from '@/components/common/Icon'
import { CancelSubscriptionModal } from '@/components/profile/CancelSubscriptionModal'
import { SubscriptionPetRow } from '@/components/profile/PetsCard/SubscriptionPetRow'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { ReactivateSubscriptionModal } from '@/components/profile/ReactivateSubscriptionModal'
import { useModal } from '@/hooks/useModal'

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
  onCancelSubscription?: (
    subscriptionId: string
  ) => Promise<{ success: boolean; error?: string }>
  onReactivateSubscription?: (
    subscriptionId: string
  ) => Promise<{ success: boolean; error?: string }>
}

const PetsCard = ({
  pets = [],
  onCancelSubscription,
  onReactivateSubscription,
}: PetsCardProps) => {
  const t = useTranslations('Profile.PetsCard')
  const [isOpen, setIsOpen] = useState(true)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [selectedPetForReactivate, setSelectedPetForReactivate] =
    useState<Pet | null>(null)
  const contentId = useId()
  const {
    isOpen: isCancelModalOpen,
    openModal: openCancelModal,
    closeModal: closeCancelModal,
  } = useModal()
  const {
    isOpen: isReactivateModalOpen,
    openModal: openReactivateModal,
    closeModal: closeReactivateModal,
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

  const handleConfirmCancel = useCallback(async () => {
    if (selectedPet && onCancelSubscription) {
      return await onCancelSubscription(selectedPet.id)
    }
    return { success: false }
  }, [selectedPet, onCancelSubscription])

  const handleCloseCancelModal = useCallback(() => {
    closeCancelModal()
    setSelectedPet(null)
  }, [closeCancelModal])

  const handleReactivateClick = useCallback(
    (pet: Pet) => {
      setSelectedPetForReactivate(pet)
      openReactivateModal()
    },
    [openReactivateModal]
  )

  const handleConfirmReactivate = useCallback(async () => {
    if (selectedPetForReactivate && onReactivateSubscription) {
      return await onReactivateSubscription(selectedPetForReactivate.id)
    }
    return { success: false }
  }, [selectedPetForReactivate, onReactivateSubscription])

  const handleCloseReactivateModal = useCallback(() => {
    closeReactivateModal()
    setSelectedPetForReactivate(null)
  }, [closeReactivateModal])

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
              <SubscriptionPetRow
                key={pet.id}
                pet={pet}
                onCancelClick={handleCancelClick}
                onReactivateClick={handleReactivateClick}
                t={t}
              />
            ))
          )}
        </div>
      )}
      {selectedPet && (
        <CancelSubscriptionModal
          isOpen={isCancelModalOpen}
          onClose={handleCloseCancelModal}
          onConfirm={handleConfirmCancel}
          petName={selectedPet.name}
        />
      )}
      {selectedPetForReactivate && (
        <ReactivateSubscriptionModal
          isOpen={isReactivateModalOpen}
          onClose={handleCloseReactivateModal}
          onConfirm={handleConfirmReactivate}
          petName={selectedPetForReactivate.name}
        />
      )}
    </ProfileCard>
  )
}

export { PetsCard }
