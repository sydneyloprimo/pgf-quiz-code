import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

interface MissionImageProps {
  src: string
  alt: string
  className?: string
  sizes: string
  showOverlay?: boolean
}

const MissionImage = ({
  src,
  alt,
  className,
  sizes,
  showOverlay = true,
}: MissionImageProps) => (
  <div className={cn('relative', 'overflow-hidden', className)}>
    <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />
    {showOverlay && (
      <div
        className="absolute inset-0 bg-secondary-950 opacity-41 mix-blend-color"
        aria-hidden="true"
      />
    )}
  </div>
)

interface MissionTitleProps {
  children: string
  className?: string
}

const MissionTitle = ({ children, className }: MissionTitleProps) => (
  <h2
    className={cn(
      'font-display font-normal',
      'heading-h1',
      'leading-14',
      'tracking-[-0.03rem]',
      'text-secondary-950',
      className
    )}
  >
    {children}
  </h2>
)

interface MissionSubsectionTitleProps {
  children: string
  className?: string
}

const MissionSubsectionTitle = ({
  children,
  className,
}: MissionSubsectionTitleProps) => (
  <h3
    className={cn(
      'font-display italic font-medium',
      'heading-h5',
      'text-2xl',
      'text-secondary-950',
      className
    )}
  >
    {children}
  </h3>
)

interface MissionParagraphProps {
  children: string
  className?: string
}

const MissionParagraph = ({ children, className }: MissionParagraphProps) => (
  <p className={cn('text-body-m text-secondary-950', className)}>{children}</p>
)

interface MissionFirstRowProps {
  title: string
  paragraph1: string
  paragraph2: string
  image1Alt: string
}

const MissionFirstRow = ({
  title,
  paragraph1,
  paragraph2,
  image1Alt,
}: MissionFirstRowProps) => (
  <div className="w-full hidden lg:flex lg:flex-row gap-44 items-start order-0">
    <MissionImage
      src="/images/about/mission-1.jpg"
      alt={image1Alt}
      className="w-110 h-144 shrink-0"
      sizes="440px"
    />
    <div className="flex flex-col gap-7 w-86 shrink-0">
      <MissionTitle>{title}</MissionTitle>
      <div className="flex flex-col gap-2.5">
        <MissionParagraph>{paragraph1}</MissionParagraph>
        <MissionParagraph>{paragraph2}</MissionParagraph>
      </div>
    </div>
  </div>
)

interface MissionSecondRowProps {
  subsectionTitle: string
  subsectionText: string
  image2Alt: string
}

const MissionSecondRow = ({
  subsectionTitle,
  subsectionText,
  image2Alt,
}: MissionSecondRowProps) => (
  <div className="w-full hidden lg:flex lg:flex-row gap-0 items-start justify-between order-0">
    <div className="bg-neutral-300 flex flex-col gap-7 w-auto shrink-0">
      <MissionSubsectionTitle>{subsectionTitle}</MissionSubsectionTitle>
      <MissionParagraph className="w-86">{subsectionText}</MissionParagraph>
    </div>
    <MissionImage
      src="/images/about/mission-2.jpg"
      alt={image2Alt}
      className="w-lg h-160 shrink-0"
      sizes="514px"
      showOverlay={false}
    />
  </div>
)

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
          className="w-full h-144 shrink-0 order-3 lg:hidden"
          sizes="100vw"
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
          className="w-full h-160 shrink-0 order-6 lg:hidden"
          sizes="100vw"
          showOverlay={false}
        />
      </div>
    </section>
  )
}

export { MissionSection }
