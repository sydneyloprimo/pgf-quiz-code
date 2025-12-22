'use client'

import { PropsWithChildren, useCallback, useEffect, useId } from 'react'

import { CloseIcon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface ModalProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
  className?: string
  closeButtonLabel: string
  ariaLabel: string
}

const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  closeButtonLabel,
  ariaLabel,
}: ModalProps) => {
  const modalId = useId()

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  const handleBackdropClick = useCallback(() => {
    onClose()
  }, [onClose])

  const handleModalClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()
    },
    []
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'bg-opacity-neutral-900-50'
      )}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        id={modalId}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          'relative',
          'bg-neutral-white',
          'shadow-lg',
          'max-w-lg w-full mx-4',
          'max-h-[90vh] overflow-y-auto',
          'p-5',
          className
        )}
        onClick={handleModalClick}
      >
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'absolute top-4 right-4',
            'p-2',
            'text-neutral-950',
            'hover:text-primary-800',
            'focus:outline-none focus:ring-2 focus:ring-primary-600',
            'rounded-full',
            'cursor-pointer'
          )}
          aria-label={closeButtonLabel}
        >
          <CloseIcon className="size-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

export { Modal }
