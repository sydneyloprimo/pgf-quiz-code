'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { AlertSuccessIcon, CloseIcon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface PromiseOfCareAlertProps {
  className?: string
}

const PromiseOfCareAlert = ({ className }: PromiseOfCareAlertProps) => {
  const t = useTranslations('PromiseOfCareAlert')
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <div
      className={cn(
        'bg-secondary-300',
        'flex flex-col items-start',
        'py-4',
        'lg:-mx-12 px-4 lg:px-12',
        className
      )}
    >
      <div className="flex gap-4 items-start w-full">
        <div className="shrink-0 size-6 flex items-center justify-center">
          <AlertSuccessIcon
            className="size-6 text-secondary-900"
            aria-hidden="true"
          />
        </div>
        <p
          className={cn(
            'font-sans font-semibold',
            'text-base leading-6',
            'text-secondary-900',
            'flex-1 min-w-0'
          )}
        >
          {t('message')}
        </p>
        <button
          type="button"
          onClick={handleClose}
          className={cn(
            'shrink-0 size-3',
            'flex items-center justify-center',
            'cursor-pointer',
            'self-center',
            'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2'
          )}
          aria-label={t('closeButton')}
        >
          <CloseIcon className="size-6 text-secondary-900" />
        </button>
      </div>
    </div>
  )
}

export { PromiseOfCareAlert }
