import Image from 'next/image'

interface ExpertCardProps {
  imageSrc: string
  imageAlt: string
  name: string
  description: string
}

const ExpertCard = ({
  imageSrc,
  imageAlt,
  name,
  description,
}: ExpertCardProps) => {
  return (
    <div className="flex flex-col gap-6 items-center w-full isolate">
      <div className="relative w-full h-72 md:h-80 overflow-hidden z-10">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 388px"
        />
        <div
          className="absolute inset-0 bg-secondary-950 opacity-41 mix-blend-color"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col gap-4 items-start justify-center max-w-full md:max-w-md w-full z-[1]">
        <div className="flex flex-col gap-4 items-start w-full">
          <div className="flex flex-col gap-4 items-start w-full relative">
            <h4 className="font-display font-semibold italic text-xl leading-7 text-secondary-950 min-w-full w-min">
              {name}
            </h4>
            <div
              className="absolute right-[-9rem] top-[2.125rem] w-36 h-px hidden md:block"
              aria-hidden="true"
            >
              <div className="w-full h-px bg-neutral-800" />
            </div>
          </div>
          <p className="font-sans text-base leading-6 text-secondary-950 w-full">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export { ExpertCard }
export type { ExpertCardProps }
