import Image from 'next/image'

interface StepCardProps {
  number: string
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
  number,
  title,
  description1,
  description2,
  imageSrc,
  imageRotation,
  imagePosition,
}: StepCardProps) => (
  <div className="bg-neutral-400 flex flex-wrap gap-8 py-0 lg:py-15 px-0 relative overflow-clip">
    <div className="bg-neutral-400 flex flex-col items-center justify-start w-[204px] shrink-0 pl-5 lg:pl-0">
      <div className="font-display text-[100px] leading-[100px] text-quaternary-800 text-center tracking-[-1px]">
        {number}
      </div>
    </div>
    <div className="flex flex-1 flex-col gap-8 items-center justify-center min-w-[393px] pb-0 lg:pb-12 pl-5 lg:pl-12 pr-[60px] pt-0 relative">
      <div className="flex flex-col gap-4 w-full">
        <h4 className="font-display text-3xl leading-10 tracking-[-0.32px] text-quaternary-800 whitespace-pre-line">
          {title}
        </h4>
        <div className="font-sans text-lg leading-7 text-quaternary-800">
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
          <Image
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
