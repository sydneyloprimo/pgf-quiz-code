import Image from 'next/image'
import { PropsWithChildren } from 'react'

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

interface MissionTitleProps extends PropsWithChildren {
  className?: string
}

const MissionTitle = ({ children, className }: MissionTitleProps) => (
  <h2
    className={cn(
      'font-display font-normal heading-h1 leading-14 tracking-[-0.03rem] text-secondary-950',
      className
    )}
  >
    {children}
  </h2>
)

interface MissionSubsectionTitleProps extends PropsWithChildren {
  className?: string
}

const MissionSubsectionTitle = ({
  children,
  className,
}: MissionSubsectionTitleProps) => (
  <h3
    className={cn(
      'font-display italic font-medium heading-h5 text-2xl text-secondary-950',
      className
    )}
  >
    {children}
  </h3>
)

interface MissionParagraphProps extends PropsWithChildren {
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

export { MissionFirstRow }
export { MissionImage }
export { MissionParagraph }
export { MissionSecondRow }
export { MissionSubsectionTitle }
export { MissionTitle }
export type { MissionFirstRowProps }
export type { MissionImageProps }
export type { MissionParagraphProps }
export type { MissionSecondRowProps }
export type { MissionSubsectionTitleProps }
export type { MissionTitleProps }
