'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'

interface ReactivateSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<{ success: boolean; error?: string }>
  petName: string
}

const ReactivateSubscriptionModal = ({
  isOpen,
  onClose,
  onConfirm,
  petName,
}: ReactivateSubscriptionModalProps) => {
  const t = useTranslations('Profile.ReactivateSubscriptionModal')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleConfirm = useCallback(async () => {
    setErrorMessage(null)
    setIsLoading(true)

    try {
      const result = await Promise.resolve(onConfirm())
      const resolved =
        result && typeof result === 'object' && 'success' in result
          ? result.success
          : true

      if (resolved) {
        onClose()
      } else {
        const err = result && typeof result === 'object' ? result.error : null
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
        const msg =
          err && typeof err === 'string' && knownCodes.has(err)
            ? t(`errors.${err}`)
            : t('errorMessage')
        setErrorMessage(msg)
      }
    } catch {
      setErrorMessage(t('errorMessage'))
    } finally {
      setIsLoading(false)
    }
  }, [onConfirm, onClose, t])

  const handleClose = useCallback(() => {
    setErrorMessage(null)
    onClose()
  }, [onClose])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeButtonLabel={t('closeButtonLabel')}
      ariaLabel={t('ariaLabel', { petName })}
      className="max-w-lg p-8"
    >
      <div className="flex flex-col gap-6">
        <h2 className="heading-h5 font-sans text-xl text-secondary-950">
          {t('heading', { petName })}
        </h2>
        <p className="text-body-m text-secondary-950">
          {t('description', { petName })}
        </p>
        {errorMessage && (
          <p className="text-body-m text-feedback-error-500" role="alert">
            {errorMessage}
          </p>
        )}
        <div className="flex flex-col md:flex-row gap-4 pt-2">
          <Button
            variant="tertiary"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full md:w-auto md:flex-1"
          >
            {t('cancelButton')}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full md:w-auto md:flex-1"
          >
            {isLoading ? t('loading') : t('confirmButton')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export { ReactivateSubscriptionModal }
