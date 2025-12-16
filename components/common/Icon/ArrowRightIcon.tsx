import React from 'react'

import { cn } from '@/utils/cn'

interface ArrowRightIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const ArrowRightIcon = ({ className, ...props }: ArrowRightIconProps) => (
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
      d="M8 1L15 8M15 8L8 15M15 8H1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export { ArrowRightIcon }
