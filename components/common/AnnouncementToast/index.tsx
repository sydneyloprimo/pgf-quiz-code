'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { AlertSuccessIcon, CloseIcon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

const AnnouncementToast = () => {
  const t = useTranslations('AnnouncementToast')
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = useCallback(() => {
    setIsDismissed(true)
  }, [])

  if (isDismissed) {
    return null
  }

  return (
    <div
      className={cn(
        'bg-feedback-success-100 w-full',
        'px-5 md:px-8 py-4',
        'flex items-center gap-4'
      )}
      role="alert"
    >
      <AlertSuccessIcon
        className="size-6 text-feedback-success-900 shrink-0"
        aria-hidden="true"
      />

      <p className="flex-1 font-semibold text-base leading-6 text-feedback-success-900">
        {t('message')}
      </p>

      <Link
        href="/waitlist"
        className={cn(
          'font-bold text-base leading-4',
          'text-feedback-success-500 underline',
          'hover:text-feedback-success-900',
          'shrink-0'
        )}
      >
        {t('ctaLink')}
      </Link>

      <button
        type="button"
        onClick={handleDismiss}
        className="p-1 text-neutral-900 hover:text-secondary-950 shrink-0"
        aria-label={t('dismissAria')}
      >
        <CloseIcon className="size-6" />
      </button>
    </div>
  )
}

export { AnnouncementToast }
