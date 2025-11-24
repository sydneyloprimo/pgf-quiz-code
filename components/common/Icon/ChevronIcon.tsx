import React from 'react'

import { cn } from '@/utils/cn'

interface ChevronIconProps extends React.ComponentProps<'svg'> {
  className?: string
  direction?: 'up' | 'down'
}

const ChevronIcon = ({
  className,
  direction = 'up',
  ...props
}: ChevronIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(direction === 'down' && 'rotate-180', className)}
    {...props}
  >
    <path
      d="M12 6L6 12L7.41 13.41L12 8.83L16.59 13.41L18 12L12 6Z"
      fill="currentColor"
    />
  </svg>
)

export { ChevronIcon }
