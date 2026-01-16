import { PropsWithChildren } from 'react'

import { cn } from '@/utils/cn'

interface ProfileCardProps extends PropsWithChildren {
  className?: string
}

const ProfileCard = ({ children, className }: ProfileCardProps) => (
  <div className={cn('bg-white text-black px-8 py-10', className)}>
    {children}
  </div>
)

export { ProfileCard }
