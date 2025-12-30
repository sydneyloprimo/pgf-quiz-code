import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { EXPERT_ITEMS } from '@/constants'
import { cn } from '@/utils/cn'

const ExpertsSection = () => {
  const t = useTranslations('About.Experts')

  const experts = EXPERT_ITEMS.map((item) => ({
    imageSrc: item.imageSrc,
    imageAlt: t(item.imageAltKey),
    name: t(item.nameKey),
    description: t(item.descriptionKey),
  }))

  return (
    <section
      className={cn(
        'w-full',
        'bg-neutral-400',
        'flex flex-col',
        'items-center',
        'px-5 md:px-24 py-20 md:py-28'
      )}
    >
      <div
        className={cn(
          'w-full',
          'flex flex-col',
          'gap-40',
          'items-center',
          'px-0 md:px-0'
        )}
      >
        <div className="w-full flex flex-col gap-20 items-center">
          <h2
            className={cn(
              'font-display',
              'text-3xl md:text-4xl',
              'leading-12',
              'tracking-tight',
              'text-secondary-950',
              'text-center',
              'w-full'
            )}
          >
            {t('title')}
          </h2>
          <div
            className={cn(
              'flex flex-col md:flex-row',
              'gap-10 md:gap-10',
              'items-start',
              'justify-center',
              'w-full'
            )}
          >
            {experts.map((expert, index) => (
              <div
                key={index}
                className={cn(
                  'flex flex-col',
                  'gap-6',
                  'items-center',
                  'justify-center',
                  'max-w-full md:max-w-96',
                  'w-full',
                  'isolate'
                )}
              >
                <div
                  className={cn(
                    'relative',
                    'w-full',
                    'h-96 md:h-[35rem]',
                    'z-[2]'
                  )}
                >
                  <Image
                    src={expert.imageSrc}
                    alt={expert.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 388px"
                  />
                  <div
                    className="absolute inset-0 bg-secondary-950 opacity-41 mix-blend-color"
                    aria-hidden="true"
                  />
                </div>
                <div
                  className={cn(
                    'flex flex-col',
                    'gap-4',
                    'items-start',
                    'justify-center',
                    'max-w-full md:max-w-[30rem]',
                    'w-full',
                    'z-[1]'
                  )}
                >
                  <div className="flex flex-col gap-4 items-start w-full">
                    <div className="flex flex-col gap-4 items-start w-full">
                      <h5
                        className={cn(
                          'font-display italic',
                          'text-xl md:text-2xl',
                          'leading-8',
                          'text-secondary-950',
                          'min-w-full',
                          'w-min'
                        )}
                      >
                        {expert.name}
                      </h5>
                    </div>
                    <div className="flex flex-col gap-4 items-center w-full">
                      <p
                        className={cn(
                          'font-sans',
                          'text-base',
                          'leading-6',
                          'text-secondary-950',
                          'w-full'
                        )}
                      >
                        {expert.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p
          className={cn(
            'font-display font-normal',
            'text-xl md:text-2xl',
            'leading-8',
            'text-secondary-950',
            'text-center',
            'w-full',
            'max-w-[55rem]'
          )}
        >
          <span className="font-display font-normal leading-8">
            {t('ecvcnParagraph1')}
          </span>
          <span className="font-display font-normal leading-8">
            {t('ecvcnParagraph2')}
          </span>
          <span className="font-display font-normal leading-8">
            {t('ecvcnParagraph3')}
          </span>
        </p>
      </div>
    </section>
  )
}

export { ExpertsSection }
