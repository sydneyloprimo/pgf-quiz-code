import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { cn } from '@/utils/cn'

const HeroSection = () => {
  const t = useTranslations('Home.Hero')

  return (
    <section
      className={cn('w-full', 'flex flex-col md:flex-row', 'min-h-[720px]')}
    >
      {/* Content Side */}
      <div
        className={cn(
          'w-full md:w-1/2',
          'bg-neutral-400',
          'flex flex-col items-center justify-center',
          'px-5 py-12 md:p-12',
          'gap-8 md:gap-10',
          'order-2 md:order-1'
        )}
      >
        <div className="flex flex-col items-center gap-2 max-w-lg w-full">
          <h1
            className={cn(
              'font-display font-semibold',
              'text-4xl md:text-5xl',
              'leading-tight md:leading-14',
              'tracking-tight',
              'text-secondary-950',
              'text-center'
            )}
          >
            {t('headline')}
          </h1>
        </div>

        <div className="flex flex-col items-center gap-8 w-full">
          <Button variant="primary" href="/quiz" className="px-4 py-4">
            {t('ctaButton')}
          </Button>

          <Link
            href="/contact"
            className={cn(
              'font-bold text-base leading-4',
              'text-primary-800 underline',
              'hover:text-primary-700'
            )}
          >
            {t('ctaLink')}
          </Link>
        </div>
      </div>

      {/* Image Side */}
      <div
        className={cn(
          'w-full md:w-1/2',
          'relative',
          'min-h-80 md:min-h-0',
          'order-1 md:order-2'
        )}
      >
        <Image
          src="/images/home/hero-bg.jpg"
          alt={t('imageAlt')}
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 bg-tertiary-800-70 mix-blend-color"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}

export { HeroSection }
