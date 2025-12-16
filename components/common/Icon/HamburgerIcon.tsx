import React from 'react'

interface HamburgerIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const HamburgerIcon = ({ className, ...props }: HamburgerIconProps) => (
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
      d="M3 12H21M3 6H21M3 18H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export { HamburgerIcon }
