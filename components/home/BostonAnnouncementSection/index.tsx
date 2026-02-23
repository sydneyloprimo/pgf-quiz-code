'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { WaitlistModal } from '@/components/common/WaitlistModal'
import { BostonAnnouncementContent } from '@/components/home/BostonAnnouncementSection/BostonAnnouncementContent'
import { BOSTON_ANNOUNCEMENT_BACKGROUND_IMAGE } from '@/constants'
import { useModal } from '@/hooks/useModal'

const BostonAnnouncementSection = () => {
  const t = useTranslations('Home.BostonAnnouncement')
  const { isOpen, openModal, closeModal } = useModal()

  return (
    <>
      <section className="w-full px-5 md:px-24 py-20">
        {/* Mobile layout - image on top, content below */}
        <div className="md:hidden w-full flex flex-col gap-0">
          <div className="w-full aspect-[3/4] relative">
            <Image
              src={BOSTON_ANNOUNCEMENT_BACKGROUND_IMAGE}
              alt={t('backgroundImageAlt')}
              fill
              className="object-cover"
              aria-hidden="true"
            />
          </div>

          <BostonAnnouncementContent
            title={t('title')}
            description1={t('description1')}
            description2={t('description2')}
            ctaLabel={t('ctaButton')}
            onCtaClick={openModal}
            variant="mobile"
          />
        </div>

        {/* Desktop layout - image with content overlay */}
        <div className="hidden md:block w-full relative min-h-[663px]">
          <Image
            src={BOSTON_ANNOUNCEMENT_BACKGROUND_IMAGE}
            alt={t('backgroundImageAlt')}
            fill
            className="object-cover"
            aria-hidden="true"
          />

          <BostonAnnouncementContent
            title={t('title')}
            description1={t('description1')}
            description2={t('description2')}
            ctaLabel={t('ctaButton')}
            onCtaClick={openModal}
            variant="desktop"
          />
        </div>
      </section>

      <WaitlistModal isOpen={isOpen} onClose={closeModal} />
    </>
  )
}

export { BostonAnnouncementSection }
