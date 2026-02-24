'use client'

import { useTranslations } from 'next-intl'

import { Link } from '@/components/common/Link'
import { QuizStep } from '@/types/enums/constants'
import { Routes } from '@/types/enums/routes'

interface QuizConfirmationBetaProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
}

const QuizConfirmationBeta = ({
  goToStep: _goToStep,
  goBack: _goBack,
  canGoBack: _canGoBack,
}: QuizConfirmationBetaProps) => {
  const t = useTranslations('Quiz.confirmationBeta')

  return (
    <div className="flex flex-col items-center justify-center pt-0 w-full">
      <div className="flex flex-col gap-8 items-center w-full max-w-md pb-16 text-center text-secondary-950">
        <h2 className="font-display text-4xl leading-12 tracking-tight w-full">
          {t('heading')}
        </h2>
        <p className="font-body text-xl leading-8 w-full">{t('description')}</p>
        <Link href={Routes.home} className="mt-4 text-primary-600 underline">
          {t('backToHome')}
        </Link>
      </div>
    </div>
  )
}

export { QuizConfirmationBeta }
