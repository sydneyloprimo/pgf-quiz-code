'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { LoginCloseButton } from '@/components/auth/LoginCloseButton'
import { LoginDivider } from '@/components/auth/LoginDivider'
import { LoginFormCard } from '@/components/auth/LoginFormCard'
import { LoginHero } from '@/components/auth/LoginHero'
import { Button } from '@/components/common/Button'
import { Routes } from '@/types/enums/routes'

export default function SignIn() {
  const t = useTranslations('SignIn')

  return (
    <div className="bg-quaternary-800 content-center flex flex-wrap gap-8 lg:gap-10 isolate items-center justify-center px-5 lg:px-24 pt-17 pb-10 lg:py-16 relative size-full min-h-screen overflow-hidden">
      {/* Background Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 bg-[url(/images/login-pattern.svg)] bg-repeat bg-auto"
        aria-hidden="true"
      />
      <LoginCloseButton />
      <LoginHero />
      <LoginFormCard>
        <div className="flex flex-col gap-4 items-center w-full">
          <Button
            variant="primary"
            className="w-full tracking-normal h-11"
            href="/api/auth/login"
          >
            {t('buttonText')}
          </Button>
          <div className="flex flex-col lg:flex-row gap-1 items-center justify-center w-full mt-3">
            <p className="text-body-l text-tertiary-900">
              {t('accountQuestion')}
            </p>
            <Link
              href={Routes.signup}
              className="text-body-m font-bold text-secondary-900 underline"
            >
              {t('createAccountLink')}
            </Link>
          </div>
        </div>
      </LoginFormCard>
      <LoginDivider />
    </div>
  )
}
