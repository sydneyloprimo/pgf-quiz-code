'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import Input from '@/components/common/Input'
import { InputDropdown } from '@/components/common/InputDropdown'
import { cn } from '@/utils/cn'

interface QuizStep2Props {
  onNext: () => void
  onBack: () => void
}

const QuizStep2 = ({ onNext, onBack }: QuizStep2Props) => {
  const t = useTranslations('Quiz.step2')
  const [name, setName] = useState('Tommy')
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState('8')
  const [weight, setWeight] = useState('18')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const genderOptions = [
    { label: t('gender.male'), value: 'male' },
    { label: t('gender.female'), value: 'female' },
  ]

  const ageOptions = Array.from({ length: 20 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }))

  const weightOptions = Array.from({ length: 200 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }))

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
            {t('heading')}
          </h2>
          <p className={cn('font-body text-lg leading-8', 'w-full')}>
            {t('description')}
          </p>
        </div>

        <div
          className={cn(
            'flex flex-col gap-6 items-center',
            'w-full',
            'text-secondary-950'
          )}
        >
          <div
            className={cn(
              'flex flex-wrap items-center justify-center gap-2',
              'font-display font-semibold text-2xl leading-8',
              'w-full'
            )}
          >
            <span>{t('namePrefix')}</span>
            <div className="w-32">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                inputClassName="text-2xl font-display font-semibold leading-8 text-secondary-950"
                state="filled"
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <span>{t('nameSuffix')}</span>
            <div className="w-32">
              <InputDropdown
                value={gender}
                onSelect={(val) => {
                  setGender(val)
                  setFocusedField(null)
                }}
                options={genderOptions}
                className="w-full"
                state="filled"
                textClassName="text-2xl font-display font-semibold leading-8 text-secondary-950"
                onOpen={() => setFocusedField('gender')}
                onClose={() => setFocusedField(null)}
              />
            </div>
            <span>{t('genderSuffix')}</span>
          </div>

          <div
            className={cn(
              'flex flex-wrap items-center justify-center gap-2',
              'font-display font-semibold text-2xl leading-8',
              'w-full'
            )}
          >
            <span>{t('agePrefix')}</span>
            <div className="w-24">
              <InputDropdown
                value={age}
                onSelect={(val) => {
                  setAge(val)
                  setFocusedField(null)
                }}
                options={ageOptions}
                className="w-full"
                state="filled"
                textClassName="text-2xl font-display font-semibold leading-8 text-secondary-950"
                onOpen={() => setFocusedField('age')}
                onClose={() => setFocusedField(null)}
              />
            </div>
            <span>{t('ageSuffix')}</span>
            <span>{t('weightPrefix')}</span>
            <div className="w-24">
              <InputDropdown
                value={weight}
                onSelect={(val) => {
                  setWeight(val)
                  setFocusedField(null)
                }}
                options={weightOptions}
                className="w-full"
                state="filled"
                textClassName="text-2xl font-display font-semibold leading-8 text-secondary-950"
                onOpen={() => setFocusedField('weight')}
                onClose={() => setFocusedField(null)}
              />
            </div>
            <span>{t('weightSuffix')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { QuizStep2 }
