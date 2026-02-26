import { useTranslations } from 'next-intl'

import { ContentfulImage } from '@/components/common/ContentfulImage'
import { cn } from '@/utils/cn'

const PrecisionBatchSection = () => {
  const t = useTranslations('Formulation.Precision')

  return (
    <section className="relative w-full bg-neutral-300 overflow-x-hidden">
      <div
        className={cn(
          'relative z-10',
          'grid grid-cols-1 lg:grid-cols-[35fr_65fr]',
          'items-stretch pb-14 lg:pb-0',
          'w-full max-w-full',
          'lg:min-h-[32rem]'
        )}
      >
        {/* Image - left side, fills container */}
        <div className="relative w-full order-1 min-h-64 lg:min-h-0 px-0">
          <div className="relative w-full h-full min-h-64 lg:min-h-0 lg:h-full aspect-[4/3] lg:aspect-auto">
            <ContentfulImage
              src="/images/formulation/precision-batch.jpg"
              alt={t('imageAlt')}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Text - right side, aligned with image */}
        <div
          className={cn(
            'relative flex flex-col',
            'px-5 pt-14 lg:pl-32 lg:pr-52',
            'w-full max-w-full order-2'
          )}
        >
          {/* Vertical line divider - extends from top, stops above body text */}
          <div
            className="absolute top-0 right-0 w-px h-20 bg-secondary-700 opacity-30 hidden lg:block"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="flex flex-col gap-6 lg:gap-8 lg:pb-36 lg:pt-36 relative z-10">
            {/* Vertical divider before heading */}
            <div
              className={cn(
                'hidden lg:block',
                'h-44',
                'border-r border-quaternary-500'
              )}
              aria-hidden="true"
            />
            <h2
              className={cn(
                'font-display',
                'text-3xl lg:text-5xl',
                'leading-tight',
                'text-secondary-950',
                'text-left lg:text-right',
                'whitespace-pre-line'
              )}
            >
              {t('title')}
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
          <ContentfulImage
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
          <ContentfulImage
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
