'use client'

import { useTranslations } from 'next-intl'
import { Controller, useWatch, UseFormReturn } from 'react-hook-form'

import { InputDropdown } from '@/components/common/InputDropdown'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import { QuizStep } from '@/types/enums/constants'
import { InputDropdownState } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizBreedSelectionProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const BREEDS = [
  'Shih Tzu',
  'Maltese',
  'Yorkshire Terrier',
  'Pomeranian',
  'Papillon',
  'Toy Poodle',
  'Chihuahua',
  'Havanese',
  'Japanese Chin',
  'Miniature Schnauzer',
  'Cavalier King Charles Spaniel',
  'French Bulldog',
  'Boston Terrier',
  'Coton de Tuléar',
  'Brussels Griffon',
  'Bichon Frise',
  'Lhasa Apso',
  'Miniature Dachshund',
  'Cocker Spaniel',
  'Jack Russell Terrier',
  'West Highland White Terrier',
  'Miniature Pinscher',
  'Italian Greyhound',
  'Scottish Terrier',
]

const QuizBreedSelection = ({
  goToStep,
  goBack,
  canGoBack,
  formMethods,
}: QuizBreedSelectionProps) => {
  const t = useTranslations('Quiz.breedSelection')
  const tQuiz = useTranslations('Quiz')
  const { control, watch } = formMethods

  const dogName =
    useWatch({
      control,
      name: 'name',
    }) || ''

  const breedOptions = BREEDS.map((breed) => ({
    label: breed,
    value: breed.toLowerCase().replace(/\s+/g, '-'),
  }))

  const selectedBreed = watch('breed')

  const handleNext = () => {
    goToStep(QuizStep.Step5)
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'pt-0 px-0 w-full'
      )}
    >
      <div className="flex flex-col gap-12 items-center w-full pb-16">
        <div
          className={cn(
            'flex flex-col gap-6 items-center',
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
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="w-full">
            <Controller
              name="breed"
              control={control}
              render={({ field: { value, onChange } }) => (
                <InputDropdown
                  value={value}
                  onSelect={onChange}
                  options={breedOptions}
                  placeholder={t('placeholder')}
                  className="w-full"
                  state={
                    value
                      ? InputDropdownState.Filled
                      : InputDropdownState.Default
                  }
                />
              )}
            />
          </div>
        </div>
      </div>
      <QuizNavigationFooter
        goBack={goBack}
        canGoBack={canGoBack}
        onContinue={handleNext}
        continueButtonText={tQuiz('continueButton')}
        continueDisabled={!selectedBreed}
      />
    </div>
  )
}

export { QuizBreedSelection }
