'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useState, type MouseEvent } from 'react'

import { AnnouncementIcon, CloseIcon } from '@/components/common/Icon'
import { WaitlistModal } from '@/components/common/WaitlistModal'
import { useModal } from '@/hooks/useModal'
import { cn } from '@/utils/cn'

const AnnouncementToast = () => {
  const t = useTranslations('AnnouncementToast')
  const [isDismissed, setIsDismissed] = useState(false)
  const { isOpen, openModal, closeModal } = useModal()

  const handleDismiss = useCallback(() => {
    setIsDismissed(true)
  }, [])

  const handleCtaClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      openModal()
    },
    [openModal]
  )

  if (isDismissed) {
    return null
  }

  return (
    <>
      <div
        className={cn(
          'bg-feedback-success-100 w-full',
          'px-5 md:px-8 py-4',
          'flex items-center gap-4'
        )}
        role="alert"
      >
        <AnnouncementIcon
          className="size-6 text-feedback-success-900 shrink-0"
          aria-hidden="true"
        />

        <p className="flex-1 font-semibold text-base leading-6 text-feedback-success-900">
          {t('message')}
        </p>

        <button
          type="button"
          onClick={handleCtaClick}
          className={cn(
            'font-bold text-base leading-4',
            'text-feedback-success-500 underline',
            'hover:text-feedback-success-900',
            'shrink-0'
          )}
        >
          {t('ctaLink')}
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 text-neutral-900 hover:text-secondary-950 shrink-0"
          aria-label={t('dismissAria')}
        >
          <CloseIcon className="size-3" />
        </button>
      </div>
      <WaitlistModal isOpen={isOpen} onClose={closeModal} />
    </>
  )
}

export { AnnouncementToast }
