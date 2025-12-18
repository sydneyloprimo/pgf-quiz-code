'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { BenefitPointerIcon } from '@/components/common/Icon'
import { BENEFITS_DATA } from '@/constants'
import { cn } from '@/utils/cn'

interface BenefitItemProps {
  number: number
  title: string
  description: string
  isActive: boolean
  onClick: () => void
}

const BenefitItem = ({
  number,
  title,
  description,
  isActive,
  onClick,
}: BenefitItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn('w-full text-left', 'flex flex-col gap-2', 'py-2')}
    aria-expanded={isActive}
  >
    <span
      className={cn(
        'font-bold text-xl leading-8',
        isActive ? 'text-secondary-700' : 'text-secondary-900'
      )}
    >
      {number}. {title}
    </span>
    {isActive && (
      <p
        className={cn(
          'font-sans text-base leading-6',
          'text-secondary-950',
          'pl-7'
        )}
      >
        {description}
      </p>
    )}
  </button>
)

interface ImagePointerProps {
  label: string
  position: { top?: string; bottom?: string; left?: string; right?: string }
  onClick: () => void
}

const ImagePointer = ({ label, position, onClick }: ImagePointerProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'absolute flex flex-col items-center gap-4',
      'cursor-pointer transition-opacity',
      'hover:opacity-80 focus:opacity-80',
      'focus:outline-none',
      'rounded-md'
    )}
    style={position}
    aria-label={label}
  >
    <BenefitPointerIcon className="size-5 text-secondary-500" />
    <span
      className={cn(
        'font-bold text-sm leading-tight',
        'text-neutral-100 text-center',
        'tracking-widest uppercase',
        'drop-shadow-md'
      )}
    >
      {label}
    </span>
  </button>
)

const BenefitsSection = () => {
  const t = useTranslations('Home.Benefits')
  const [activeIndex, setActiveIndex] = useState(0)

  const handleBenefitClick = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const benefits = [...BENEFITS_DATA]
    .sort((a, b) => a.benefitIndex - b.benefitIndex)
    .map((benefit) => ({
      title: t(benefit.titleKey),
      description: t(benefit.descriptionKey),
    }))

  const pointers = BENEFITS_DATA.filter(
    (benefit) => benefit.pointerLabelKey && benefit.pointerPosition
  ).map((benefit) => ({
    label: t(benefit.pointerLabelKey!),
    position: benefit.pointerPosition!,
    benefitIndex: benefit.benefitIndex,
  }))

  return (
    <section className={cn('w-full', 'px-5 md:px-11 py-14')}>
      <div
        className={cn('w-full', 'flex flex-col lg:flex-row', 'items-stretch')}
      >
        {/* Left Content - Accordion */}
        <div
          className={cn(
            'w-full lg:w-1/2',
            'bg-neutral-400',
            'px-8 md:px-16 py-16 md:py-20',
            'flex flex-col gap-12'
          )}
        >
          <div className="flex flex-col gap-4">
            <h2
              className={cn(
                'font-display font-semibold',
                'text-3xl md:text-4xl',
                'leading-tight md:leading-12',
                'text-secondary-950'
              )}
            >
              {t('title')}
            </h2>
            <p
              className={cn(
                'font-sans text-lg leading-7',
                'text-secondary-950'
              )}
            >
              {t('description')}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {benefits.map((benefit, index) => (
              <BenefitItem
                key={index}
                number={index + 1}
                title={benefit.title}
                description={benefit.description}
                isActive={activeIndex === index}
                onClick={() => handleBenefitClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Right Content - Image with Pointers */}
        <div
          className={cn(
            'w-full lg:w-1/2',
            'relative',
            'min-h-96 lg:min-h-0',
            'overflow-hidden'
          )}
        >
          <Image
            src="/images/home/benefits-dog.jpg"
            alt={t('imageAlt')}
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-tertiary-800-70 mix-blend-color"
            aria-hidden="true"
          />

          {/* Pointers - Hidden on mobile */}
          <div className="hidden lg:block absolute inset-16 md:inset-24">
            {pointers.map((pointer, index) => (
              <ImagePointer
                key={index}
                label={pointer.label}
                position={pointer.position}
                onClick={() => handleBenefitClick(pointer.benefitIndex)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { BenefitsSection }
