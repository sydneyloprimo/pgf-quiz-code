'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { BODY_SHAPE_OPTIONS, BODY_SHAPE_IMAGE_ASPECT_RATIO } from '@/constants'
import { cn } from '@/utils/cn'

interface BodyShapeSelectorProps {
  value?: string
  onSelect: (value: string) => void
  className?: string
}

const BodyShapeSelector = ({
  value,
  onSelect,
  className,
}: BodyShapeSelectorProps) => {
  const t = useTranslations('Quiz.bodyShape')

  return (
    <div className={cn('flex flex-wrap gap-4 items-stretch w-full', className)}>
      {BODY_SHAPE_OPTIONS.map((option) => {
        const isSelected = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              'flex flex-1 flex-col gap-2 items-center',
              'bg-neutral-white border border-primary-950',
              'max-h-96 max-w-59',
              'px-4 py-5',
              'text-center',
              'transition-colors',
              'hover:bg-secondary-100 hover:border-secondary-600',
              'focus:bg-secondary-100 focus:border-secondary-600 focus:outline-none',
              'active:bg-secondary-200 active:border-secondary-600',
              {
                'bg-secondary-100 border-2 border-secondary-600': isSelected,
              }
            )}
            aria-pressed={isSelected}
            aria-label={t(option.imageAltKey)}
          >
            <div className="flex flex-col gap-2 items-start opacity-80 py-4 w-full">
              <div
                className="relative w-full"
                style={{ aspectRatio: BODY_SHAPE_IMAGE_ASPECT_RATIO }}
              >
                <Image
                  src={option.image}
                  alt={t(option.imageAltKey)}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center w-full">
              <p className="font-display font-bold text-2xl leading-8 w-full">
                {t(option.titleKey)}
              </p>
              <p className="font-body text-base leading-6 w-full">
                {t(option.descriptionKey)}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export { BodyShapeSelector }
