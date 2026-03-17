'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { ProgressBar } from './ProgressBar'

import { Button } from '@/components/common/Button'
import { ArrowLeftIcon, CloseIcon, PGFTextLogo } from '@/components/common/Icon'
import { QUIZ_RETURN_PATH_KEY } from '@/constants'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'
import { safeSessionStorage } from '@/utils/safeSessionStorage'

interface QuizHeaderProps {
  visitedSteps: number
  showProgressBar?: boolean
  centerLogo?: boolean
  showBackButton?: boolean
  hideBackButtonOnMobile?: boolean
  hideCloseButtonOnMobile?: boolean
  onBack?: () => void
}

const QuizHeader = ({
  visitedSteps,
  showProgressBar = true,
  centerLogo = false,
  showBackButton = false,
  hideBackButtonOnMobile = false,
  hideCloseButtonOnMobile = false,
  onBack,
}: QuizHeaderProps) => {
  const t = useTranslations('Quiz')
  const [closeHref, setCloseHref] = useState<string>(Routes.home)

  useEffect(() => {
    const stored = safeSessionStorage.getItem(QUIZ_RETURN_PATH_KEY)
    const allowedPaths = new Set<string>(Object.values(Routes))
    setCloseHref(stored && allowedPaths.has(stored) ? stored : Routes.home)
  }, [])

  const handleBackClick = () => {
    onBack?.()
  }

  const clearReturnPath = () => {
    safeSessionStorage.removeItem(QUIZ_RETURN_PATH_KEY)
  }

  return (
    <header className="bg-neutral-300 py-10 px-5 lg:px-24">
      <div
        className={cn(
          'flex items-center',
          centerLogo ? 'justify-center relative' : 'justify-between',
          'md:px-5 pb-4'
        )}
      >
        {showBackButton ? (
          <Button
            type="button"
            variant="tertiary"
            onClick={handleBackClick}
            data-qa="quiz-back-button"
            leftIcon={<ArrowLeftIcon className="size-3.5" />}
            className={cn(
              'h-10 w-10 p-0 cursor-pointer',
              'absolute left-5 sm:left-24',
              hideBackButtonOnMobile && 'hidden md:flex'
            )}
            aria-label={t('backButton')}
          />
        ) : (
          !centerLogo && (
            <Link
              href={Routes.home}
              className="flex items-center"
              data-qa="quiz-logo"
              onClick={clearReturnPath}
            >
              <PGFTextLogo
                className="h-auto w-full text-neutral-950"
                aria-label={t('title')}
              />
            </Link>
          )
        )}
        {centerLogo && (
          <Link
            href={Routes.home}
            data-qa="quiz-logo"
            onClick={clearReturnPath}
          >
            <PGFTextLogo
              className="h-auto w-full text-neutral-950"
              aria-label={t('title')}
            />
          </Link>
        )}
        <Button
          variant="tertiary"
          href={closeHref}
          data-qa="quiz-close-button"
          leftIcon={<CloseIcon className="size-3.5" />}
          onClick={clearReturnPath}
          className={cn(
            'h-10 w-10 p-0',
            centerLogo && 'absolute right-5 sm:right-24',
            hideCloseButtonOnMobile && 'hidden md:flex'
          )}
          aria-label={t('closeButton')}
        />
      </div>
      {showProgressBar && (
        <div className="md:px-5 pb-4">
          <ProgressBar visitedSteps={visitedSteps} />
        </div>
      )}
    </header>
  )
}

export { QuizHeader }
