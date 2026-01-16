'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const DeleteAccountModal = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) => {
  const t = useTranslations('Profile.DeleteAccountModal')

  const handleConfirm = useCallback(() => {
    onConfirm()
    onClose()
  }, [onConfirm, onClose])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeButtonLabel={t('closeButtonLabel')}
      ariaLabel={t('ariaLabel')}
      className="max-w-lg p-8"
    >
      <div className="flex flex-col gap-6">
        <h2 className="heading-h5 font-sans text-xl text-secondary-950">
          {t('heading')}
        </h2>
        <p className="text-body-m text-secondary-950">{t('description')}</p>
        <div className="flex flex-col md:flex-row gap-4 pt-2">
          <Button
            variant="tertiary"
            onClick={onClose}
            className="w-full md:w-auto md:flex-1"
          >
            {t('cancelButton')}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            className="w-full md:w-auto md:flex-1 bg-feedback-error-500 hover:bg-feedback-error-600 active:bg-feedback-error-700 focus:bg-feedback-error-600"
          >
            {t('confirmButton')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export { DeleteAccountModal }
