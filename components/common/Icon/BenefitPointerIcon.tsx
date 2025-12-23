import React from 'react'

interface BenefitPointerIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const BenefitPointerIcon = ({
  className,
  ...props
}: BenefitPointerIconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <circle cx="10" cy="10" r="5" fill="currentColor" />
  </svg>
)

export { BenefitPointerIcon }
