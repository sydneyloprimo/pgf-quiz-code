'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { Button } from '@/components/common/Button'
import { PGFTextLogo } from '@/components/common/Icon'
import { useEmailCustomer } from '@/hooks/useEmailCustomer'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

const Footer = () => {
  const t = useTranslations('Footer')
  const tErrors = useTranslations('Common.EmailCustomer.errors')
  const [email, setEmail] = useState('')

  const handleSuccess = useCallback(() => {
    setEmail('')
  }, [])

  const {
    createEmailCustomer,
    isLoading,
    error,
    clearError,
    customerId,
    reset,
  } = useEmailCustomer(handleSuccess)

  const isSubscribed = Boolean(customerId)

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value)
      if (error) {
        clearError()
      }
      if (customerId) {
        reset()
      }
    },
    [error, clearError, customerId, reset]
  )

  const handleSubscribe = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      await createEmailCustomer(email)
    },
    [email, createEmailCustomer]
  )

  const navLinks = [
    { href: Routes.home, label: t('linkHome') },
    { href: '/recipe', label: t('linkRecipe') },
    { href: '/about', label: t('linkAbout') },
    { href: '/contact', label: t('linkContact') },
  ]

  return (
    <footer className={cn('w-full', 'flex flex-col lg:flex-row', 'flex-wrap')}>
      {/* Left Side - Newsletter */}
      <div
        className={cn(
          'w-full lg:flex-1',
          'bg-secondary-950',
          'px-8 md:px-10 py-16 md:py-20',
          'flex flex-col justify-between gap-12',
          'min-h-80 lg:min-h-[500px]'
        )}
      >
        <div className="flex flex-col gap-5 text-neutral-100">
          <h3
            className={cn(
              'font-display font-semibold',
              'text-3xl md:text-4xl',
              'leading-tight md:leading-12',
              'tracking-tight'
            )}
          >
            {t('newsletterTitle')}
          </h3>
          <p className="font-sans text-base leading-6 max-w-xs">
            {t('newsletterDescription')}
          </p>
        </div>

        <form
          onSubmit={handleSubscribe}
          className={cn('w-full', 'flex flex-col gap-2')}
        >
          <div
            className={cn(
              'w-full',
              'bg-neutral-100',
              'flex items-center justify-between',
              'pl-4 pr-2 py-2'
            )}
          >
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder={t('emailPlaceholder')}
              disabled={isLoading}
              className={cn(
                'flex-1',
                'font-sans text-base leading-5',
                'text-neutral-900',
                'bg-transparent',
                'outline-none',
                'placeholder:text-neutral-900',
                'disabled:opacity-50'
              )}
              aria-label={t('emailAria')}
            />
            <Button
              type="submit"
              variant="primary"
              className="px-4 py-3"
              disabled={isLoading || !email.trim() || isSubscribed}
            >
              {isSubscribed ? t('subscribedButton') : t('subscribeButton')}
            </Button>
          </div>
          {error && (
            <p className="font-sans text-sm leading-5 text-feedback-error-500">
              {tErrors(error)}
            </p>
          )}
        </form>
      </div>

      {/* Center - Image */}
      <div
        className={cn(
          'w-full lg:flex-1',
          'relative',
          'min-h-80 lg:min-h-[500px]',
          'order-last lg:order-0'
        )}
      >
        <Image
          src="/images/home/footer-dog.jpg"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-tertiary-800-70 mix-blend-color"
          aria-hidden="true"
        />
      </div>

      {/* Right Side - Navigation */}
      <div
        className={cn(
          'w-full lg:flex-1',
          'bg-secondary-950',
          'px-8 md:px-10 py-16 md:py-20',
          'flex flex-col justify-between gap-12',
          'min-h-80 lg:min-h-[500px]'
        )}
      >
        <Link href={Routes.home} aria-label={t('logoAria')}>
          <PGFTextLogo className="h-11 w-auto text-neutral-white" />
        </Link>

        <nav className="flex flex-col gap-4" aria-label={t('footerNavAria')}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-bold text-base leading-4',
                'text-quaternary-100 underline',
                'hover:text-neutral-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
