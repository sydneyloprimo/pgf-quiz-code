import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { cn } from '@/utils/cn'

const CTASection = () => {
  const t = useTranslations('About.CTA')

  return (
    <section
      className={cn(
        'w-full',
        'flex flex-col',
        'items-center justify-center',
        'px-5 md:px-24 py-20 md:py-20',
        'relative',
        'bg-quaternary-800',
        'overflow-hidden'
      )}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-quaternary-800" />
        <div className="absolute inset-0 mix-blend-overlay opacity-50 overflow-hidden">
          <Image
            src="/images/about/cta-bg.jpg"
            alt=""
            fill
            className="object-cover scale-150"
            sizes="100vw"
          />
        </div>
      </div>
      <div
        className={cn(
          'relative z-10',
          'flex flex-col',
          'gap-10 md:gap-10',
          'items-center',
          'w-full'
        )}
      >
        <div
          className={cn(
            'flex flex-col',
            'gap-10 md:gap-10',
            'items-center',
            'px-12 md:px-12 py-0',
            'w-full'
          )}
        >
          <p
            className={cn(
              'font-display font-normal italic',
              'text-3xl md:text-4xl',
              'leading-10',
              'tracking-tight',
              'text-neutral-white',
              'text-center',
              'w-full'
            )}
          >
            {t('quote')}
          </p>
        </div>
        <Button
          variant="tertiary"
          href="/formulation"
          className="max-w-md px-4 py-4"
        >
          {t('button')}
        </Button>
      </div>
    </section>
  )
}

export { CTASection }
