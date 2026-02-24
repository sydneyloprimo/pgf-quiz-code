import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface CommitmentCardProps {
  text: ReactNode
  hasBorder?: boolean
}

const CommitmentCard = ({ text, hasBorder = false }: CommitmentCardProps) => (
  <div
    className={cn(
      'px-5 flex flex-col lg:flex-row flex-1 gap-10 items-center lg:items-center lg:pl-5 lg:px-14 py-16 lg:py-5 min-w-0 w-full relative',
      hasBorder && 'lg:border-r border-r-0 lg:border-r-quaternary-200'
    )}
  >
    <div className="flex gap-10 items-center lg:w-auto w-full justify-center">
      <p className="font-sans font-normal text-base leading-6 text-quaternary-800 flex-1 text-center lg:text-left">
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
