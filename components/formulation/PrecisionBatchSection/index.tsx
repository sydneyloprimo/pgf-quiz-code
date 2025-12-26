import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

const PrecisionBatchSection = () => {
  const t = useTranslations('Formulation.Precision')

  return (
    <section
      className={cn('relative w-full', 'bg-neutral-300', 'overflow-x-hidden')}
    >
      <div
        className={cn(
          'relative z-10',
          'grid grid-cols-1 md:grid-cols-2',
          'items-center',
          'w-full max-w-full'
        )}
      >
        {/* Image side - image has its own background */}
        <div
          className={cn(
            'relative w-full',
            'h-auto md:h-[850px]',
            'overflow-hidden md:overflow-visible'
          )}
        >
          {/* Mobile: natural image sizing */}
          <div className="relative w-full h-auto md:hidden">
            <Image
              src="/images/formulation/precision-batch-image-mobile.png"
              alt={t('imageAlt')}
              width={848}
              height={1071}
              className="w-full object-contain"
            />
          </div>
          {/* Desktop: fixed height with overflow */}
          <div className="hidden md:block absolute inset-0 overflow-visible">
            <div className="relative h-full w-[200%] overflow-visible pointer-events-none">
              <Image
                src="/images/formulation/precision-batch-image.png"
                alt={t('imageAlt')}
                fill
                className="object-contain object-left"
              />
            </div>
          </div>
        </div>

        {/* Text side */}
        <div
          className={cn(
            'relative flex flex-col',
            'p-5 md:pl-40 md:pt-20 md:pr-[60px] md:pb-[140px]',
            'w-full max-w-full'
          )}
        >
          {/* Decorative pattern - top right */}
          <div
            className="absolute top-0 right-0 pointer-events-none hidden md:block"
            aria-hidden="true"
          >
            <Image
              src="/images/formulation/precision-decorative.svg"
              alt=""
              width={200}
              height={200}
              className="w-32 h-32 opacity-20"
            />
          </div>

          {/* Vertical line divider - extends from top, stops above body text */}
          <div
            className="absolute top-0 right-0 w-px h-20 bg-secondary-700 opacity-30 hidden md:block"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="flex flex-col gap-6 md:gap-8 relative z-10">
            {/* Vertical divider before heading */}
            <div
              className={cn(
                'hidden md:block',
                'h-[178px]',
                'border-r border-quaternary-500',
                'mb-6'
              )}
              aria-hidden="true"
            />
            <h2
              className={cn(
                'font-display',
                'text-3xl md:text-4xl desktop:text-5xl',
                'leading-tight',
                'text-secondary-950',
                'text-left md:text-right'
              )}
            >
              {(() => {
                const title = t('title')
                const words = title.split(' ')
                const firstWord = words[0]
                const rest = words.slice(1).join(' ')
                return (
                  <>
                    {firstWord}
                    <br />
                    {rest}
                  </>
                )
              })()}
            </h2>
            <p
              className={cn(
                'font-sans',
                'text-base',
                'leading-normal',
                'text-secondary-950',
                'text-left md:text-justify'
              )}
            >
              {t('description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { PrecisionBatchSection }
