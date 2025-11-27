'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { OptionSelect } from '@/components/common/OptionSelect'
import { cn } from '@/utils/cn'

interface QuizStep3Props {
  onNext: () => void
  onBack: () => void
}

const QuizStep3 = ({ onNext, onBack }: QuizStep3Props) => {
  const t = useTranslations('Quiz.step3')
  const [selectedValue, setSelectedValue] = useState<string>('')

  const dogName = 'Tommy'

  const options = [
    { label: t('options.neutered'), value: 'neutered' },
    { label: t('options.intact'), value: 'intact' },
  ]

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
    </div>
  )
}

export { QuizStep3 }





