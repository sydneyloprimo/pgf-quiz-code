'use client'

import { PropsWithChildren, useCallback, useEffect, useId, useRef } from 'react'

import { FOCUSABLE_SELECTOR } from '@/utils/accessibility'
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
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return
      }

      const focusable =
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)

      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
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
      previousFocusRef.current = document.activeElement as HTMLElement
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'

      requestAnimationFrame(() => {
        const firstFocusable =
          panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        firstFocusable?.focus()
      })
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''

      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
        previousFocusRef.current = null
      }
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
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          'fixed top-0 h-full w-full md:w-[500px]',
          position === 'left' ? 'left-0' : 'right-0',
          'bg-neutral-100',
          'flex flex-col',
          'transition-transform duration-300',
          'ease-in-out',
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
