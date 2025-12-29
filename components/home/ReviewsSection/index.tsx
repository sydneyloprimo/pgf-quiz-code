'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'

import { ArrowLeftIcon, ArrowRightIcon } from '@/components/common/Icon'
import { REVIEWS_DATA } from '@/constants'
import { cn } from '@/utils/cn'

interface ReviewCardProps {
  image: string
  quote: string
  review: string
  name: string
}

const ReviewCard = ({ image, quote, review, name }: ReviewCardProps) => (
  <div className="flex-1 min-w-80 border border-tertiary-700 px-8 py-6 flex flex-col gap-5">
    <div className="relative size-20 shrink-0">
      <Image src={image} alt={name} fill className="object-cover" />
    </div>

    <p className="font-display font-normal italic text-2xl md:text-3xl leading-9 tracking-tight text-secondary-950">
      {quote}
    </p>

    <div className="flex flex-col gap-2 text-secondary-950">
      <p className="font-sans text-base leading-6">&ldquo;{review}&rdquo;</p>
      <p className="font-bold text-xl leading-tight tracking-tight">{name}</p>
    </div>
  </div>
)

const ReviewsSection = () => {
  const t = useTranslations('Home.Reviews')
  const [currentIndex, setCurrentIndex] = useState(0)

  const reviews = useMemo(
    () =>
      REVIEWS_DATA.map((review) => ({
        image: review.image,
        quote: t(review.quoteKey),
        review: t(review.reviewKey),
        name: t(review.nameKey),
      })),
    [t]
  )

  const visibleReviews = useMemo(() => {
    const nextIndex = (currentIndex + 1) % reviews.length
    return [reviews[currentIndex], reviews[nextIndex]]
  }, [currentIndex, reviews])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))
  }, [reviews.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))
  }, [reviews.length])

  return (
    <section
      className={cn(
        'w-full border-t border-neutral-600 px-5 md:px-11 py-20 md:py-36 relative overflow-hidden',
        'md:bg-[url(/images/home/reviews-molecules.svg)] md:bg-no-repeat md:bg-left md:bg-size-[auto_100%]'
      )}
    >
      {/* Mirrored background on the right */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-[url(/images/home/reviews-molecules.svg)] bg-no-repeat bg-left bg-size-[auto_100%] scale-x-[-1] pointer-events-none hidden md:block"
        aria-hidden="true"
      />

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 items-center relative z-10">
        <h2 className="font-display text-3xl md:text-4xl leading-tight md:leading-12 tracking-tight text-secondary-950 text-center">
          {t('title')}
        </h2>

        {/* Desktop: Show two reviews at a time */}
        <div className="hidden md:flex gap-8 w-full">
          {visibleReviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>

        {/* Mobile: Show one review at a time */}
        <div className="md:hidden w-full">
          <ReviewCard {...reviews[currentIndex]} />
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-6">
          <button
            type="button"
            onClick={handlePrev}
            className="p-3 cursor-pointer text-secondary-950 hover:text-secondary-700"
            aria-label={t('prevAria')}
          >
            <ArrowLeftIcon className="size-6" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-3 cursor-pointer text-secondary-950 hover:text-secondary-700"
            aria-label={t('nextAria')}
          >
            <ArrowRightIcon className="size-6" />
          </button>
        </div>
      </div>
    </section>
  )
}

export { ReviewsSection }
