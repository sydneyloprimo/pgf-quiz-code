import { ContentfulImage } from '@/components/common/ContentfulImage'

interface StepCardProps {
  title: string
  description1: string
  description2: string
  imageSrc: string
  imageRotation: number
  imagePosition: {
    bottom: string
    left: string
  }
}

const StepCard = ({
  title,
  description1,
  description2,
  imageSrc,
  imageRotation,
  imagePosition,
}: StepCardProps) => (
  <div className="bg-neutral-400 flex justify-center py-0 pl-5 lg:pl-0 pr-5 relative overflow-clip">
    <div className="flex flex-1 flex-col gap-8 items-center justify-center w-full pb-0 pt-0 relative">
      <div className="flex flex-col gap-4 w-full">
        <h4 className="font-display text-3xl leading-10 tracking-tight text-quaternary-800 whitespace-pre-line">
          {title}
        </h4>
        <div className="font-sans text-lg leading-normal text-quaternary-800">
          <p className="mb-2.5">{description1}</p>
          <p>{description2}</p>
        </div>
      </div>
      <div
        className="absolute"
        style={{
          bottom: imagePosition.bottom,
          left: imagePosition.left,
        }}
      >
        <div
          className="flex-none"
          style={{ transform: `rotate(${imageRotation}deg)` }}
        >
          <ContentfulImage
            src={imageSrc}
            alt=""
            width={136}
            height={131}
            className="h-auto w-auto"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </div>
)

export { StepCard }
