'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { Link } from '@/components/common/Link'
import {
  QUIZ_DOG_ILLUSTRATION_HEIGHT,
  QUIZ_DOG_ILLUSTRATION_WIDTH,
} from '@/constants'
import { cn } from '@/utils/cn'

interface QuizStep1Props {
  onNext: () => void
}

const QuizStep1 = ({ onNext }: QuizStep1Props) => {
  const t = useTranslations('Quiz.step1')

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'pt-0 px-0 w-full'
      )}
    >
      <div className="flex flex-col gap-4 items-center w-full pb-[60px]">
        <div className="relative shrink-0">
          <Image
            src="/images/quiz-dog-illustration.png"
            alt="Dog illustration"
            width={QUIZ_DOG_ILLUSTRATION_WIDTH}
            height={QUIZ_DOG_ILLUSTRATION_HEIGHT}
            className="object-contain"
            priority
          />
        </div>
        <div
          className={cn(
            'flex flex-col gap-6 items-center',
            'max-w-[700px] text-center w-full',
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
      <div className="flex flex-col gap-8 items-center w-full">
        <Button variant="primary" className="max-w-sm w-full" onClick={onNext}>
          {t('button')}
        </Button>
        <Link href="#" className="text-secondary-900">
          {t('link')}
        </Link>
      </div>
    </div>
  )
}

export { QuizStep1 }
