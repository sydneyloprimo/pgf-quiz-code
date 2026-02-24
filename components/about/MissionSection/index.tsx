import { useTranslations } from 'next-intl'

import {
  MissionFirstRow,
  MissionImage,
  MissionParagraph,
  MissionSecondRow,
  MissionSubsectionTitle,
  MissionTitle,
} from './MissionSectionComponents'

const MissionSection = () => {
  const t = useTranslations('About.Mission')

  return (
    <section className="w-full px-5 lg:px-24 py-10 lg:py-20 flex flex-col gap-20 lg:gap-48">
      <div className="w-full flex flex-col lg:contents gap-10">
        <MissionTitle className="w-full order-1 lg:hidden">
          {t('title')}
        </MissionTitle>

        <MissionParagraph className="w-full lg:w-86 order-2 lg:hidden">
          {t('paragraph1')}
        </MissionParagraph>

        <MissionFirstRow
          title={t('title')}
          paragraph1={t('paragraph1')}
          paragraph2={t('paragraph2')}
          image1Alt={t('image1Alt')}
        />

        <MissionImage
          src="/images/about/mission-1.jpg"
          alt={t('image1Alt')}
          className="w-full max-w-2xl mx-auto aspect-[4/5] shrink-0 order-3 lg:hidden"
          sizes="(max-width: 768px) 100vw, 672px"
        />

        <MissionSubsectionTitle className="bg-neutral-300 w-full order-4 lg:hidden">
          {t('subsectionTitle')}
        </MissionSubsectionTitle>

        <MissionSecondRow
          subsectionTitle={t('subsectionTitle')}
          subsectionText={t('subsectionText')}
          image2Alt={t('image2Alt')}
        />

        <MissionParagraph className="bg-neutral-300 w-full lg:w-86 order-5 lg:hidden">
          {t('subsectionText')}
        </MissionParagraph>

        <MissionImage
          src="/images/about/mission-2.jpg"
          alt={t('image2Alt')}
          className="w-full max-w-2xl mx-auto aspect-[4/5] shrink-0 order-6 lg:hidden"
          sizes="(max-width: 768px) 100vw, 672px"
          showOverlay={false}
        />
      </div>
    </section>
  )
}

export { MissionSection }
