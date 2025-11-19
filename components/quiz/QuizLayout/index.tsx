'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'

import { Routes } from '@/types/enums/routes'

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
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between px-5 md:px-[119px] py-5 bg-white">
        <h1 className="text-xl md:text-2xl font-bold text-black">
          {t('title')}
        </h1>
        <Link
          href={Routes.home}
          data-qa="quiz-close-button"
          className="btn-secondary h-10! w-10! p-0!"
          aria-label={t('closeButton')}
        >
          <Image
            src="/icons/cross.svg"
            alt={t('closeButton')}
            width={16}
            height={16}
          />
        </Link>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="flex items-center justify-between gap-4 px-5 md:px-[119px] py-5 bg-white border-t border-light-grey">
        {stepNumber > 1 && (
          <button
            type="button"
            onClick={onBack}
            data-qa="quiz-back-button"
            className="btn-secondary"
          >
            {t('backButton')}
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          data-qa="quiz-continue-button"
          className={stepNumber === 1 ? 'btn-primary ml-auto' : 'btn-primary'}
        >
          {t('continueButton')}
        </button>
      </footer>
    </div>
  )
}

export default QuizLayout
