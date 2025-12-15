'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { WaitlistSuccessModal } from './WaitlistSuccessModal'

import { Button } from '@/components/common/Button'
import Input from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { useEmailCustomer } from '@/hooks/useEmailCustomer'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

const WaitlistModal = ({ isOpen, onClose }: WaitlistModalProps) => {
  const t = useTranslations('Quiz.waitlistModal')
  const tErrors = useTranslations('Common.EmailCustomer.errors')

  const [email, setEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSuccess = useCallback(() => {
    setIsSuccess(true)
  }, [])

  const { createEmailCustomer, isLoading, error, reset } =
    useEmailCustomer(handleSuccess)

  const handleEmailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value)
    },
    []
  )

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      await createEmailCustomer(email)
    },
    [email, createEmailCustomer]
  )

  const handleClose = useCallback(() => {
    setEmail('')
    setIsSuccess(false)
    reset()
    onClose()
  }, [onClose, reset])

  const translatedError = error ? tErrors(error) : undefined

  if (isSuccess) {
    return <WaitlistSuccessModal isOpen={isOpen} onClose={handleClose} />
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeButtonLabel={t('closeButtonLabel')}
      ariaLabel={t('ariaLabel')}
    >
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-4 w-full">
          <h2 className="font-body text-xl text-secondary-950 text-left font-bold">
            {t('heading')}!
          </h2>
          <p className="font-body text-base text-neutral-900 text-left">
            {t('description')}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <Input
            id="waitlist-email"
            name="waitlist-email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            label={t('emailLabel')}
            labelClassName="text-secondary-900 font-body text-base font-bold leading-5 text-left"
            error={translatedError}
            disabled={isLoading}
          />
          <div className="flex gap-4 w-full">
            <Button
              type="button"
              variant="tertiary"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              {t('cancelButton')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !email.trim()}
              className="flex-1"
            >
              {isLoading ? t('submittingButton') : t('submitButton')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export { WaitlistModal }
