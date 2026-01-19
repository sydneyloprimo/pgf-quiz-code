import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

const MissionSection = () => {
  const t = useTranslations('About.Mission')

  return (
    <section
      className={cn(
        'w-full',
        'px-5 lg:px-24 py-10 lg:py-20',
        'flex flex-col',
        'gap-20 lg:gap-48'
      )}
    >
      {/* Mobile: Single column with reordered elements. Desktop: Two rows with original layout */}
      <div className={cn('w-full', 'flex flex-col lg:contents', 'gap-10')}>
        {/* Title - Order 1 on mobile only, hidden on desktop (shown in desktop container) */}
        <h2
          className={cn(
            'font-display font-normal',
            'heading-h1',
            'leading-14',
            'tracking-[-0.03rem]',
            'text-secondary-950',
            'w-full',
            'order-1 lg:hidden'
          )}
        >
          {t('title')}
        </h2>

        {/* Paragraph 1 - Order 2 on mobile, part of first row on desktop */}
        <p
          className={cn(
            'text-body-m text-secondary-950',
            'w-full lg:w-86',
            'order-2 lg:hidden'
          )}
        >
          {t('paragraph1')}
        </p>

        {/* First Row Container for Desktop */}
        <div
          className={cn(
            'w-full',
            'hidden lg:flex lg:flex-row',
            'gap-44',
            'items-start',
            'order-0'
          )}
        >
          {/* Image 1 - Desktop only, left side */}
          <div
            className={cn(
              'relative',
              'w-110',
              'h-144',
              'shrink-0',
              'overflow-hidden'
            )}
          >
            <Image
              src="/images/about/mission-1.jpg"
              alt={t('image1Alt')}
              fill
              className="object-cover"
              sizes="440px"
            />
            <div
              className="absolute inset-0 bg-secondary-950 opacity-41 mix-blend-color"
              aria-hidden="true"
            />
          </div>
          {/* Title and Paragraphs Container - Desktop only, right side */}
          <div className={cn('flex flex-col', 'gap-7', 'w-86', 'shrink-0')}>
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
              <p className="text-body-m text-secondary-950">
                {t('paragraph1')}
              </p>
              <p className="text-body-m text-secondary-950">
                {t('paragraph2')}
              </p>
            </div>
          </div>
        </div>

        {/* Image 1 - Mobile only, Order 3 */}
        <div
          className={cn(
            'relative',
            'w-full',
            'h-144',
            'shrink-0',
            'overflow-hidden',
            'order-3 lg:hidden'
          )}
        >
          <Image
            src="/images/about/mission-1.jpg"
            alt={t('image1Alt')}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-secondary-950 opacity-41 mix-blend-color"
            aria-hidden="true"
          />
        </div>

        {/* Subsection Title - Order 4 on mobile only, hidden on desktop (shown in desktop container) */}
        <h3
          className={cn(
            'font-display italic font-medium',
            'heading-h5',
            'text-2xl',
            'text-secondary-950',
            'bg-neutral-300',
            'w-full',
            'order-4 lg:hidden'
          )}
        >
          {t('subsectionTitle')}
        </h3>

        {/* Second Row Container for Desktop */}
        <div
          className={cn(
            'w-full',
            'hidden lg:flex lg:flex-row',
            'gap-0',
            'items-start',
            'justify-between',
            'order-0'
          )}
        >
          {/* Subsection Title and Text - Desktop only, left side */}
          <div
            className={cn(
              'bg-neutral-300',
              'flex flex-col',
              'gap-7',
              'w-auto',
              'shrink-0'
            )}
          >
            <h3
              className={cn(
                'font-display italic font-medium',
                'heading-h5',
                'text-2xl',
                'text-secondary-950'
              )}
            >
              {t('subsectionTitle')}
            </h3>
            <p className="text-body-m text-secondary-950 w-86">
              {t('subsectionText')}
            </p>
          </div>
          {/* Image 2 - Desktop only, right side */}
          <div
            className={cn(
              'relative',
              'w-lg',
              'h-160',
              'shrink-0',
              'overflow-hidden'
            )}
          >
            <Image
              src="/images/about/mission-2.jpg"
              alt={t('image2Alt')}
              fill
              className="object-cover"
              sizes="514px"
            />
          </div>
        </div>

        {/* Subsection Text - Order 5 on mobile, part of second row on desktop */}
        <p
          className={cn(
            'text-body-m text-secondary-950',
            'bg-neutral-300',
            'w-full lg:w-86',
            'order-5 lg:hidden'
          )}
        >
          {t('subsectionText')}
        </p>

        {/* Image 2 - Order 6 on mobile, part of second row on desktop */}
        <div
          className={cn(
            'relative',
            'w-full',
            'h-160',
            'shrink-0',
            'overflow-hidden',
            'order-6 lg:hidden'
          )}
        >
          <Image
            src="/images/about/mission-2.jpg"
            alt={t('image2Alt')}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  )
}

export { MissionSection }
