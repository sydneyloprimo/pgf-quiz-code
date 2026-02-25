'use client'

import { useTranslations } from 'next-intl'
import type { CSSProperties } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'

import { ContentfulImage } from '@/components/common/ContentfulImage'
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
    className="w-full text-left flex flex-col gap-2 py-2"
    aria-expanded={isActive}
  >
    <span
      className={cn(
        'font-bold text-xl leading-8 text-secondary-900',
        isActive ? 'lg:text-secondary-700' : 'lg:text-secondary-900'
      )}
    >
      {number}. {title}
    </span>
    <p
      className={cn(
        'block font-sans text-base leading-6 text-secondary-950 pl-7',
        isActive ? 'lg:block' : 'lg:hidden'
      )}
    >
      {description}
    </p>
  </button>
)

/**
 * Posición del pointer por breakpoint. Definir las claves que necesites:
 * - mobile: viewport &lt; 768px
 * - md: 768px ≤ viewport &lt; 1024px
 * - lg: viewport ≥ 1024px
 * Cada valor es un objeto con top/right/left/bottom (ej: { top: '46%', right: '35%' }).
 * Si falta un breakpoint, se usa el siguiente disponible como fallback.
 */
type PositionBreakpoints = {
  mobile?: { top?: string; right?: string; left?: string; bottom?: string }
  md?: { top?: string; right?: string; left?: string; bottom?: string }
  lg?: { top?: string; right?: string; left?: string; bottom?: string }
}

interface ImagePointerProps {
  label: string
  position: PositionBreakpoints
  labelSide: 'left' | 'right'
  onClick: () => void
}

const useResolvedPosition = (position: PositionBreakpoints) => {
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isMd = useMediaQuery('(min-width: 768px)')
  return useMemo(() => {
    const resolved = isLg
      ? (position.lg ?? position.md ?? position.mobile)
      : isMd
        ? (position.md ?? position.mobile ?? position.lg)
        : (position.mobile ?? position.md ?? position.lg)
    return (resolved ?? {}) as CSSProperties
  }, [position, isLg, isMd])
}

const ImagePointer = ({
  label,
  position,
  labelSide,
  onClick,
}: ImagePointerProps) => {
  const style = useResolvedPosition(position)
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute flex items-center gap-2 cursor-pointer transition-transform',
        'hover:scale-110 focus:scale-110 focus:outline-none rounded-md',
        labelSide === 'left' ? 'flex-row-reverse' : 'flex-row'
      )}
      style={style}
      aria-label={label}
    >
      <BenefitPointerIcon className="size-5 shrink-0 text-secondary-500" />
      <span className="font-bold text-sm leading-tight text-neutral-100 whitespace-nowrap tracking-widest uppercase drop-shadow-md">
        {label}
      </span>
    </button>
  )
}

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
    labelSide: benefit.labelSide,
    benefitIndex: benefit.benefitIndex,
  }))

  return (
    <section className="w-full px-5 md:px-11 py-8">
      <div className="w-full flex flex-col lg:flex-row items-stretch">
        {/* Left Content - Accordion */}
        <div className="w-full lg:w-1/2 bg-neutral-400 px-8 md:px-16 py-16 md:py-20 flex flex-col gap-12 order-1 lg:order-1">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-3xl md:text-4xl leading-tight md:leading-12 text-secondary-950">
              {t('title')}
            </h2>
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
        <div className="w-full lg:w-1/2 relative aspect-[2/3] lg:max-h-[700px] overflow-hidden order-2 lg:order-2">
          <ContentfulImage
            src="/images/home/new-benefit-dog.jpg"
            alt={t('imageAlt')}
            fill
            className="object-cover"
          />

          {/* Pointers */}
          <div className="absolute inset-0">
            {pointers.map((pointer, index) => (
              <ImagePointer
                key={index}
                label={pointer.label}
                position={pointer.position}
                labelSide={pointer.labelSide}
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
