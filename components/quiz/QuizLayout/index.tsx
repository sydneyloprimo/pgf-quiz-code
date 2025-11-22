'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'

import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

interface QuizLayoutProps extends PropsWithChildren {
  stepNumber: number
  onNext: () => void
  onBack: () => void
}

const QuizLayout = ({
  children,
  stepNumber,
  onNext,
  onBack,
}: QuizLayoutProps) => {
  const t = useTranslations('Quiz')

  return (
    <div className="flex flex-col min-h-screen bg-neutral-300 w-full">
      <header
        className={cn(
          'flex items-center justify-between',
          'px-5 md:px-28 py-5',
          'bg-neutral-300'
        )}
      >
        <Link href={Routes.home} data-qa="quiz-logo">
          <Image
            src="/icons/logo-quiz.png"
            alt={t('title')}
            width={232}
            height={36}
            className="h-9 w-56"
            priority
          />
        </Link>
        <Link
          href={Routes.home}
          data-qa="quiz-close-button"
          className={cn(
            'bg-neutral-white border border-secondary-900',
            'flex items-center justify-center',
            'h-10 w-10 p-3',
            'cursor-pointer'
          )}
          aria-label={t('closeButton')}
        >
          <Image
            src="/icons/cross.svg"
            alt={t('closeButton')}
            width={24}
            height={24}
          />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 md:px-28">
        {children}
      </main>

      {stepNumber > 1 && (
        <footer
          className={cn(
            'flex items-center justify-between gap-4',
            'px-5 md:px-28 py-5',
            'bg-neutral-300 border-t border-neutral-600'
          )}
        >
          <button
            type="button"
            onClick={onBack}
            data-qa="quiz-back-button"
            className="btn-secondary"
          >
            {t('backButton')}
          </button>
          <button
            type="button"
            onClick={onNext}
            data-qa="quiz-continue-button"
            className="btn-primary"
          >
            {t('continueButton')}
          </button>
        </footer>
      )}
    </div>
  )
}

export default QuizLayout
