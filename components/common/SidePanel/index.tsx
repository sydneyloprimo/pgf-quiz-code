'use client'

import { PropsWithChildren, useCallback, useEffect, useId } from 'react'

import { cn } from '@/utils/cn'

interface SidePanelProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
  className?: string
  ariaLabel: string
  position?: 'left' | 'right'
}

const SidePanel = ({
  isOpen,
  onClose,
  children,
  className,
  ariaLabel,
  position = 'left',
}: SidePanelProps) => {
  const panelId = useId()

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

  const handlePanelClick = useCallback(
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
      className={cn('fixed inset-0 z-50', 'bg-black/25')}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          'fixed top-0 h-full w-full md:w-[500px]',
          position === 'left' ? 'left-0' : 'right-0',
          'bg-neutral-100',
          'flex flex-col',
          'transition-transform duration-300 ease-in-out',
          'transform translate-x-0',
          className
        )}
        onClick={handlePanelClick}
      >
        {children}
      </div>
    </div>
  )
}

export { SidePanel }
export type { SidePanelProps }
