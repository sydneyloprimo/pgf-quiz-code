import { ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface CommitmentCardProps {
  icon: ReactNode
  text: string
  hasBorder?: boolean
}

const CommitmentCard = ({
  icon,
  text,
  hasBorder = false,
}: CommitmentCardProps) => (
  <div
    className={cn(
      'flex flex-col lg:flex-row flex-1 gap-10 items-center lg:items-center px-5 lg:px-14 py-16 lg:py-5 min-w-0 w-full relative',
      hasBorder && 'lg:border-r border-r-0 lg:border-r-quaternary-200'
    )}
  >
    <div className="flex gap-10 items-center lg:w-auto">
      <div className="flex-shrink-0 text-quaternary-800">{icon}</div>
      <p className="font-sans font-normal text-base leading-6 text-quaternary-800 flex-1">
        {text}
      </p>
    </div>
    {hasBorder && (
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-px bg-quaternary-200 lg:hidden"
        aria-hidden="true"
      />
    )}
  </div>
)

export { CommitmentCard }
export type { CommitmentCardProps }
