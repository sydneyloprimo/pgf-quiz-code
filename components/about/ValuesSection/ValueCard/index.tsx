import { ReactNode } from 'react'

interface ValueCardProps {
  icon: ReactNode
  title: string
  description: string
}

const ValueCard = ({ icon, title, description }: ValueCardProps) => (
  <div className="flex flex-col gap-10 px-5 md:px-12 py-10 md:py-24 w-full">
    <div className="size-11 text-quaternary-200">{icon}</div>
    <div className="flex flex-col gap-7 not-italic text-neutral-white">
      <h3 className="font-display font-normal italic text-4xl md:text-4xl leading-12 text-neutral-white">
        {title}
      </h3>
      <p className="font-sans font-normal text-sm leading-6 text-neutral-white">
        {description}
      </p>
    </div>
  </div>
)

export { ValueCard }
export type { ValueCardProps }
