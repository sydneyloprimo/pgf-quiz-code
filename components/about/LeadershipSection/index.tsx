import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

const LeadershipSection = () => {
  const t = useTranslations('About.Leadership')
  const paragraph1 = t('paragraph1')
  const firstChar = paragraph1.charAt(0).toUpperCase()
  const restOfText = paragraph1.substring(1)

  return (
    <section
      className={cn(
        'w-full',
        'h-[100vw] md:h-[40vw]',
        'pt-14',
        'px-5 md:px-24',
        'flex flex-col md:flex-row',
        'gap-0',
        'items-stretch',
        'justify-start'
      )}
    >
      <div
        className={cn(
          'w-full md:w-2/5',
          'flex-shrink-0',
          'relative',
          'overflow-hidden',
          'aspect-square'
        )}
      >
        <Image
          src="/images/about/leadership.jpg"
          alt={t('imageAlt')}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
        <div
          className="absolute inset-0 bg-secondary-950 opacity-41 mix-blend-color"
          aria-hidden="true"
        />
      </div>
      <div
        className={cn(
          'w-full md:w-3/5',
          'h-full',
          'bg-neutral-400',
          'px-10 md:px-24',
          'flex flex-col',
          'justify-center',
          'gap-4 md:gap-8',
          'relative'
        )}
      >
        <div className="flex flex-col gap-4">
          <p
            className={cn(
              'font-sans',
              'text-base',
              'leading-6',
              'text-secondary-950',
              'mb-2.5'
            )}
          >
            <span className="text-3xl">{firstChar}</span>
            <span className="text-base">{restOfText}</span>
          </p>
          <p
            className={cn(
              'font-sans',
              'text-base',
              'leading-6',
              'text-secondary-950'
            )}
          >
            {t('paragraph2')}
          </p>
        </div>
        <div className="flex items-center justify-end md:justify-start mt-8">
          <p
            className={cn(
              'font-sans font-bold',
              'text-base',
              'leading-6',
              'text-secondary-950',
              'text-right md:text-left'
            )}
          >
            {t('signature')}
          </p>
        </div>
        <div
          className="absolute right-0 bottom-0 w-40 h-28 rotate-[110deg]"
          aria-hidden="true"
        >
          <Image
            src="/icons/leadership-signature.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  )
}

export { LeadershipSection }
