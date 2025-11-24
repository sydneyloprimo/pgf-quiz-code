import React from 'react'

interface DecrementIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const DecrementIcon = ({ className, ...props }: DecrementIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M15 19l-7-7 7-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export { DecrementIcon }
