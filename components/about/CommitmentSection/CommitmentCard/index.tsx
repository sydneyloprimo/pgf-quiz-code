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
      'flex flex-1 gap-10',
      'items-center',
      'px-14 py-5',
      'min-w-0',
      hasBorder && 'border-r border-r-quaternary-200'
    )}
  >
    <div className="flex-shrink-0 text-quaternary-800">{icon}</div>
    <p
      className={cn(
        'font-sans font-normal',
        'text-base',
        'leading-6',
        'text-quaternary-800',
        'flex-1'
      )}
    >
      {text}
    </p>
  </div>
)

export { CommitmentCard }
export type { CommitmentCardProps }
