'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Button } from '@/components/common/Button'
import { DeleteAccountModal } from '@/components/profile/DeleteAccountModal'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { useModal } from '@/hooks/useModal'

export default function ProfilePage() {
  const t = useTranslations('Profile')
  const {
    isOpen: isDeleteAccountModalOpen,
    openModal: openDeleteAccountModal,
    closeModal: closeDeleteAccountModal,
  } = useModal()

  const handleDeleteAccount = useCallback(() => {
    // TODO: Implement delete account logic
    closeDeleteAccountModal()
  }, [closeDeleteAccountModal])

  return (
    <div className="flex min-h-screen flex-col gap-6 md:gap-12 px-5 md:px-11 py-6 md:py-12">
      <ProfileHeader />
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
