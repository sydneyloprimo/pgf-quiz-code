import React from 'react'

import { cn } from '@/utils/cn'

interface ArrowLeftIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const ArrowLeftIcon = ({ className, ...props }: ArrowLeftIconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
    {...props}
  >
    <path
      d="M8 15L1 8M1 8L8 1M1 8H15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export { ArrowLeftIcon }
