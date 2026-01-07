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
  moleculeSrc: string
}

const StepCard = ({
  number,
  title,
  description1,
  description2,
  imageSrc,
  imageRotation,
  imagePosition,
  moleculeSrc,
}: StepCardProps) => (
  <div className="bg-neutral-400 flex flex-wrap gap-8 py-0 lg:py-16 px-0 relative overflow-clip">
    <div className="bg-neutral-400 flex flex-col items-start justify-start w-52 shrink-0 pl-5 lg:pl-0">
      <div className="font-display text-8xl leading-[100px] text-quaternary-800 text-center tracking-tight">
        {number}
      </div>
      <Image
        src={moleculeSrc}
        alt=""
        width={189}
        height={189}
        className="h-auto w-auto mt-5 self-end"
        aria-hidden="true"
      />
    </div>
    <div className="flex flex-1 flex-col gap-8 items-center justify-center min-w-96 pb-0 lg:pb-12 pl-5 lg:pl-12 pr-16 pt-0 relative">
      <div className="flex flex-col gap-4 w-full">
        <h4 className="font-display text-3xl leading-10 tracking-tight text-quaternary-800 whitespace-pre-line">
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
