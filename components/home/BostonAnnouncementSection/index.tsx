'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { WaitlistModal } from '@/components/common/WaitlistModal'
import { useModal } from '@/hooks/useModal'
import { cn } from '@/utils/cn'

const BostonAnnouncementSection = () => {
  const t = useTranslations('Home.BostonAnnouncement')
  const { isOpen, openModal, closeModal } = useModal()

  return (
    <>
      <section className={cn('w-full', 'px-5 md:px-24', 'py-20')}>
        <div
          className={cn(
            'w-full',
            'relative',
            'min-h-[500px] md:min-h-[663px]',
            'flex items-center justify-center',
            'px-5 py-12'
          )}
        >
          {/* Background Image */}
          <Image
            src="/images/home/boston-announcement-bg.jpg"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />

          {/* Content Card */}
          <div
            className={cn(
              'relative z-10',
              'w-full max-w-xl',
              'bg-neutral-300',
              'px-10 md:px-20 py-14 md:py-16',
              'flex flex-col gap-8 items-center',
              'text-center'
            )}
          >
            <div className="flex flex-col gap-4">
              <h2
                className={cn(
                  'font-display',
                  'text-3xl md:text-4xl',
                  'leading-tight md:leading-12',
                  'tracking-tight',
                  'text-secondary-950'
                )}
              >
                {t('title')}
              </h2>
              <div
                className={cn(
                  'font-sans text-base leading-6',
                  'text-secondary-900'
                )}
              >
                <p className="mb-2">{t('description1')}</p>
                <p>{t('description2')}</p>
              </div>
            </div>

            <Button variant="secondary" onClick={openModal}>
              {t('ctaButton')}
            </Button>
          </div>
        </div>
      </section>

      <WaitlistModal isOpen={isOpen} onClose={closeModal} />
    </>
  )
}

export { BostonAnnouncementSection }
