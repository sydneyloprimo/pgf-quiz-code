'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { ArrowLeftIcon } from '@/components/common/Icon'
import {
  QUIZ_DOG_ILLUSTRATION_SOURCE_HEIGHT,
  QUIZ_DOG_ILLUSTRATION_SOURCE_WIDTH,
} from '@/constants'
import { QuizStep } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizPlus25LbsProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
}

const QuizPlus25Lbs = ({ goToStep, goBack, canGoBack }: QuizPlus25LbsProps) => {
  const t = useTranslations('Quiz.plus25Lbs')

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-12 w-full',
        'gap-16'
      )}
    >
      <div className="flex flex-col gap-3 items-center w-full">
        <div className="relative shrink-0 h-36 w-48">
          <Image
            src="/images/quiz-dog-illustration.png"
            alt={t('imageAlt')}
            width={QUIZ_DOG_ILLUSTRATION_SOURCE_WIDTH}
            height={QUIZ_DOG_ILLUSTRATION_SOURCE_HEIGHT}
            className="object-contain"
            priority
          />
        </div>
        <div
          className={cn(
            'flex flex-col gap-6 items-center',
            'text-center w-full',
            'text-secondary-950',
            'max-w-2xl'
          )}
        >
          <h2
            className={cn(
              'font-display',
              'text-4xl leading-12 tracking-tight',
              'w-full'
            )}
          >
            {t('heading')}
          </h2>
          <p className={cn('font-body text-xl leading-8', 'w-full')}>
            {t('description')}
          </p>
        </div>
      </div>
      <div
        className={cn(
          'flex flex-col md:flex-row',
          'items-center justify-center gap-4',
          'w-full'
        )}
      >
        <Button
          type="button"
          onClick={() => goToStep(QuizStep.PetInfo)}
          variant="tertiary"
          leftIcon={<ArrowLeftIcon className="size-5" />}
          className="w-full md:w-auto md:order-1 order-2"
        >
          {t('changeWeightsButton')}
        </Button>
        <Button
          type="button"
          onClick={() => {
            // TODO: Implement waitlist functionality
          }}
          variant="primary"
          className="w-full md:w-auto md:min-w-64 md:order-2 order-1"
        >
          {t('joinWaitlistButton')}
        </Button>
      </div>
    </div>
  )
}

export { QuizPlus25Lbs }
