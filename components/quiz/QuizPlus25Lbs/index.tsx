'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import { QuizStep } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizPlus25LbsProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
}

const QuizPlus25Lbs = ({ goToStep, goBack, canGoBack }: QuizPlus25LbsProps) => {
  const t = useTranslations('Quiz.step3')

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'pt-0 px-0 w-full'
      )}
    >
      <div className="flex flex-col gap-6 items-center w-full pb-12">
        <div className="relative shrink-0">
          <Image
            src="/images/quiz-dog-illustration.png"
            alt="Dog illustration"
            width={268}
            height={266}
            className="object-contain"
            priority
          />
        </div>
        <div
          className={cn(
            'flex flex-col gap-4 items-center',
            'text-center w-full',
            'text-secondary-950'
          )}
        >
          <h2
            className={cn(
              'font-display font-semibold',
              'text-4xl leading-12 tracking-tight',
              'w-full'
            )}
          >
            {t('heading')}
          </h2>
          <p className={cn('font-body text-lg leading-8', 'w-full')}>
            {t('description')}
          </p>
        </div>
      </div>
      <QuizNavigationFooter
        goBack={goBack}
        canGoBack={canGoBack}
        onContinue={goBack}
        continueButtonText={t('changeWeightsButton')}
      />
    </div>
  )
}

export { QuizPlus25Lbs }
