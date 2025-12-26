import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

const PrecisionBatchSection = () => {
  const t = useTranslations('Formulation.Precision')

  return (
    <section
      className={cn(
        'relative w-full',
        'px-5 md:px-24 desktop:px-32',
        'bg-neutral-100',
        'overflow-visible'
      )}
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        aria-hidden="true"
      >
        <Image
          src="/images/formulation/precision-decorative.svg"
          alt=""
          width={200}
          height={200}
          className="absolute w-48 h-48 opacity-30"
          style={{ left: '2%', top: '20%' }}
        />
      </div>

      <div
        className={cn(
          'relative z-10',
          'grid grid-cols-1 md:grid-cols-2',
          'gap-8 md:gap-16',
          'items-stretch',
          'max-w-6xl'
        )}
      >
        {/* Image side - extends beyond container */}
        <div
          className={cn(
            'relative w-full h-full min-h-[400px] md:min-h-[600px]',
            'md:-ml-24 desktop:-ml-32'
          )}
        >
          <Image
            src="/images/formulation/spoon-image.png"
            alt={t('imageAlt')}
            fill
            className="object-cover"
          />
        </div>

        {/* Text side */}
        <div className="flex flex-col gap-4 md:gap-6 text-right">
          <h2
            className={cn(
              'font-display',
              'text-3xl md:text-4xl desktop:text-5xl',
              'leading-tight',
              'text-secondary-950'
            )}
          >
            {t('title')}
          </h2>
          <p
            className={cn(
              'font-sans',
              'text-base md:text-lg',
              'leading-relaxed',
              'text-secondary-800'
            )}
          >
            {t('description')}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center w-full mt-16">
        <Image
          src="/images/formulation/divider.svg"
          alt=""
          width={199}
          height={2}
          className="w-full max-w-md"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}

export { PrecisionBatchSection }
