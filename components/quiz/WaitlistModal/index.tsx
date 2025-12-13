'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { Button } from '@/components/common/Button'
import { AlertSuccessIcon } from '@/components/common/Icon'
import Input from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import {
  WAITLIST_MODAL_ILLUSTRATION_HEIGHT,
  WAITLIST_MODAL_ILLUSTRATION_WIDTH,
} from '@/constants'
import { useEmailCustomer } from '@/hooks/useEmailCustomer'
import { cn } from '@/utils/cn'

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
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        closeButtonLabel={t('closeButtonLabel')}
        ariaLabel={t('successAriaLabel')}
      >
        <div
          className={cn(
            'flex flex-col items-center',
            'px-8 py-12',
            'gap-8',
            'text-center'
          )}
        >
          <AlertSuccessIcon className="size-16 text-feedback-success-500" />
          <div className="flex flex-col gap-4">
            <h2
              className={cn(
                'font-display',
                'text-3xl leading-10 tracking-tight',
                'text-secondary-950'
              )}
            >
              {t('successHeading')}
            </h2>
            <p className="font-body text-lg leading-7 text-neutral-900">
              {t('successDescription')}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={handleClose}
            className="min-w-48"
          >
            {t('successButton')}
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeButtonLabel={t('closeButtonLabel')}
      ariaLabel={t('ariaLabel')}
    >
      <div
        className={cn(
          'flex flex-col items-center',
          'px-8 py-12',
          'gap-8',
          'text-center'
        )}
      >
        <div className="relative shrink-0 h-28 w-36">
          <Image
            src="/images/quiz-dog-illustration.png"
            alt={t('imageAlt')}
            width={WAITLIST_MODAL_ILLUSTRATION_WIDTH}
            height={WAITLIST_MODAL_ILLUSTRATION_HEIGHT}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col gap-4">
          <h2
            className={cn(
              'font-display',
              'text-3xl leading-10 tracking-tight',
              'text-secondary-950'
            )}
          >
            {t('heading')}
          </h2>
          <p className="font-body text-lg leading-7 text-neutral-900">
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
            placeholder={t('emailPlaceholder')}
            error={translatedError}
            disabled={isLoading}
            aria-label={t('emailLabel')}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !email.trim()}
            className="w-full"
          >
            {isLoading ? t('submittingButton') : t('submitButton')}
          </Button>
        </form>
      </div>
    </Modal>
  )
}

export { WaitlistModal }
