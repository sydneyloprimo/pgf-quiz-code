'use client'

import { useTranslations } from 'next-intl'
import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'

import { ContentfulImage } from '@/components/common/ContentfulImage'
import { BenefitPointerIcon } from '@/components/common/Icon'
import { BENEFITS_DATA, type PointerPosition } from '@/constants'
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
    className="w-full text-left flex flex-col gap-2 py-2 cursor-pointer"
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
 * Returns a resolver that turns pointerPosition (mobile/md/lg breakpoints) into
 * CSS top/right/left/bottom for the current viewport. Called once in the parent
 * so all pointers share the same media queries instead of one per pointer.
 */
const useBreakpointPosition = () => {
  const isLgQuery = useMediaQuery('(min-width: 1024px)')
  const isMdQuery = useMediaQuery('(min-width: 768px)')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  // Before mount (SSR/first paint) assume desktop so lg positions apply correctly
  const isLg = mounted ? isLgQuery : true
  const isMd = mounted ? isMdQuery : true

  return useCallback(
    (position: PointerPosition): CSSProperties => {
      // Pick the breakpoint object for current viewport; fallback to next available
      const resolved = isLg
        ? (position.lg ?? position.md ?? position.mobile)
        : isMd
          ? (position.md ?? position.mobile ?? position.lg)
          : (position.mobile ?? position.md ?? position.lg)
      return (resolved ?? {}) as CSSProperties
    },
    [isLg, isMd]
  )
}

interface ImagePointerProps {
  label: string
  style: CSSProperties
  labelSide: 'left' | 'right'
  onClick: () => void
}

const ImagePointer = ({
  label,
  style,
  labelSide,
  onClick,
}: ImagePointerProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'absolute flex flex-col items-center gap-2 cursor-pointer transition-transform',
      'hover:scale-110 focus:scale-110 focus:outline-none rounded-md',
      labelSide === 'left' ? 'lg:flex-row-reverse' : 'lg:flex-row'
    )}
    style={style}
    aria-label={label}
  >
    <BenefitPointerIcon className="size-5 shrink-0 text-secondary-500" />
    <span className="font-bold text-sm leading-tight text-neutral-100 whitespace-nowrap tracking-widest uppercase drop-shadow-md text-center">
      {label}
    </span>
  </button>
)

const BenefitsSection = () => {
  const t = useTranslations('Home.Benefits')
  const [activeIndex, setActiveIndex] = useState(0)
  const resolvePosition = useBreakpointPosition() // one resolver for all pointers

  const handleBenefitClick = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const benefits = [...BENEFITS_DATA]
    .sort((a, b) => a.benefitIndex - b.benefitIndex)
    .map((benefit) => ({
      title: t(benefit.titleKey),
      description: t(benefit.descriptionKey),
    }))

  // Resolve each benefit's pointerPosition (mobile/md/lg) to CSS for current viewport
  const pointers = useMemo(
    () =>
      BENEFITS_DATA.filter(
        (benefit) => benefit.pointerLabelKey && benefit.pointerPosition
      ).map((benefit) => ({
        label: t(benefit.pointerLabelKey!),
        style: resolvePosition(benefit.pointerPosition!),
        labelSide: benefit.labelSide,
        benefitIndex: benefit.benefitIndex,
      })),
    [t, resolvePosition]
  )

  return (
    <section className="w-full px-5 md:px-11 py-8">
      <div className="w-full flex flex-col lg:flex-row items-stretch">
        {/* Left Content - Accordion */}
        <div className="w-full lg:w-1/2 bg-neutral-400 px-8 md:px-16 py-16 md:py-20 flex flex-col gap-12 order-1">
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
        <div className="w-full lg:w-1/2 relative aspect-[2/3] lg:max-h-[700px] overflow-hidden order-2">
          <ContentfulImage
            src="/images/home/new-benefit-dog.jpg"
            alt={t('imageAlt')}
            fill
            className="object-cover"
          />

          {/* Pointers: */}
          <div className="absolute inset-0">
            {pointers.map((pointer) => (
              <ImagePointer
                key={pointer.benefitIndex}
                label={pointer.label}
                style={pointer.style}
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
