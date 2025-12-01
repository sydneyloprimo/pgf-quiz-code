'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { OptionSelect } from '@/components/common/OptionSelect'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import { QuizStep } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizStep3Props {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
}

const QuizStep3 = ({ goToStep, goBack, canGoBack }: QuizStep3Props) => {
  const t = useTranslations('Quiz.step3')
  const tQuiz = useTranslations('Quiz')
  const [selectedValue, setSelectedValue] = useState<string>('')

  const dogName = 'Tommy'

  const options = [
    { label: t('options.neutered'), value: 'neutered' },
    { label: t('options.intact'), value: 'intact' },
  ]

  const handleNext = () => {
    goToStep(QuizStep.Step4)
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'pt-0 px-0 w-full'
      )}
    >
      <div className="flex flex-col gap-6 items-center w-full pb-12">
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
            {t('heading', { name: dogName })}
          </h2>
          <p className={cn('font-body text-lg leading-8', 'w-full')}>
            {t('description', { name: dogName })}
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center w-full">
          <OptionSelect
            options={options}
            value={selectedValue}
            onSelect={setSelectedValue}
            className="w-full"
          />
        </div>
      </div>
      <QuizNavigationFooter
        goBack={goBack}
        canGoBack={canGoBack}
        onContinue={handleNext}
        continueButtonText={tQuiz('continueButton')}
        continueDisabled={!selectedValue}
      />
    </div>
  )
}

export { QuizStep3 }
