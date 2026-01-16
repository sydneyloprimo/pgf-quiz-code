import React from 'react'

import { cn } from '@/utils/cn'

interface MinusIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const MinusIcon = ({ className, ...props }: MinusIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
    {...props}
  >
    <path
      d="M5 12H19"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export { MinusIcon }
