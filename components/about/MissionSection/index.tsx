import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

const MissionSection = () => {
  const t = useTranslations('About.Mission')

  return (
    <section
      className={cn(
        'w-full',
        'px-5 md:px-24 py-10 md:py-20',
        'flex flex-col',
        'gap-48'
      )}
    >
      {/* First Row: Image (left) + 180px gap + Heading + Paragraphs (right) */}
      <div
        className={cn(
          'w-full',
          'flex flex-col md:flex-row',
          'gap-10 md:gap-44',
          'items-start'
        )}
      >
        <div
          className={cn(
            'relative',
            'w-full md:w-[27.5rem]',
            'h-[36rem]',
            'shrink-0',
            'overflow-hidden'
          )}
        >
          <Image
            src="/images/about/mission-1.jpg"
            alt={t('image1Alt')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 440px"
          />
          <div
            className="absolute inset-0 bg-secondary-950 opacity-41 mix-blend-color"
            aria-hidden="true"
          />
        </div>
        <div
          className={cn(
            'flex flex-col',
            'gap-7',
            'w-full md:w-[21.5rem]',
            'shrink-0'
          )}
        >
          <h2
            className={cn(
              'font-display font-normal',
              'heading-h1',
              'leading-14',
              'tracking-[-0.03rem]',
              'text-secondary-950'
            )}
          >
            {t('title')}
          </h2>
          <div className="flex flex-col gap-2.5">
            <p className="text-body-m text-secondary-950">{t('paragraph1')}</p>
            <p className="text-body-m text-secondary-950">{t('paragraph2')}</p>
          </div>
        </div>
      </div>

      {/* Second Row: Heading + Paragraph (left) + spacing + Image (right) */}
      <div
        className={cn(
          'w-full',
          'flex flex-col md:flex-row',
          'gap-10 md:gap-0',
          'items-start',
          'justify-between'
        )}
      >
        <div
          className={cn(
            'bg-neutral-300',
            'flex flex-col',
            'gap-7',
            'w-full md:w-auto',
            'shrink-0'
          )}
        >
          <h3
            className={cn(
              'font-display italic',
              'heading-h5',
              'text-secondary-950'
            )}
          >
            {t('subsectionTitle')}
          </h3>
          <p className="text-body-m text-secondary-950 w-full md:w-[21.5rem]">
            {t('subsectionText')}
          </p>
        </div>
        <div
          className={cn(
            'relative',
            'w-full md:w-[32rem]',
            'h-[40rem]',
            'shrink-0',
            'overflow-hidden'
          )}
        >
          <Image
            src="/images/about/mission-2.jpg"
            alt={t('image2Alt')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 514px"
          />
        </div>
      </div>
    </section>
  )
}

export { MissionSection }
