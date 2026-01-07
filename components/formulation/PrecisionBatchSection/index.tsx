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
          'grid grid-cols-1 lg:grid-cols-2',
          'items-center',
          'w-full max-w-full'
        )}
      >
        {/* Image side - image has its own background */}
        <div
          className={cn(
            'relative w-full',
            'h-auto lg:h-[850px]',
            'overflow-hidden lg:overflow-visible'
          )}
        >
          {/* Mobile/Tablet: natural image sizing */}
          <div className="relative w-full h-auto lg:hidden">
            <Image
              src="/images/formulation/precision-batch-image-mobile.png"
              alt={t('imageAlt')}
              width={848}
              height={1071}
              className="w-full object-contain"
            />
          </div>
          {/* Desktop: fixed height with overflow */}
          <div className="hidden lg:block absolute inset-0 overflow-visible">
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
            'p-5 lg:pl-40 lg:pt-20 lg:pr-16 lg:pb-36',
            'w-full max-w-full'
          )}
        >
          {/* Vertical line divider - extends from top, stops above body text */}
          <div
            className="absolute top-0 right-0 w-px h-20 bg-secondary-700 opacity-30 hidden lg:block"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="flex flex-col gap-6 lg:gap-8 relative z-10">
            {/* Vertical divider before heading */}
            <div
              className={cn(
                'hidden lg:block',
                'h-44',
                'border-r border-quaternary-500',
                'mb-6'
              )}
              aria-hidden="true"
            />
            <h2
              className={cn(
                'font-display',
                'text-3xl lg:text-5xl',
                'leading-tight',
                'text-secondary-950',
                'text-left lg:text-right'
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
                'text-left lg:text-justify'
              )}
            >
              {t('description')}
            </p>
          </div>
        </div>

        {/* Decorative pattern - top right */}
        <div
          className="absolute top-0 right-0 pointer-events-none hidden lg:flex lg:flex-col"
          aria-hidden="true"
        >
          <Image
            src="/images/formulation/precision-decorative.svg"
            alt=""
            width={255}
            height={150}
            className="w-[255px] h-[150px] opacity-20"
          />
        </div>
        <div
          className="absolute top-0 right-0 pointer-events-none hidden lg:flex lg:flex-col"
          aria-hidden="true"
        >
          <Image
            src="/images/formulation/precision-decorative-2.svg"
            alt=""
            width={318}
            height={149}
            className="w-[318px] h-[149px] opacity-20"
          />
        </div>
      </div>
    </section>
  )
}

export { PrecisionBatchSection }
