import React from 'react'

interface FeaturePharmIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const FeaturePharmIcon = ({ className, ...props }: FeaturePharmIconProps) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M20 8V16H12V24H20V56H28V24H36V56H44V24H52V16H44V8H36V16H28V8H20ZM24 20H28V24H24V20ZM36 20H40V24H36V20ZM16 28H20V32H16V28ZM44 28H48V32H44V28ZM24 36H28V40H24V36ZM36 36H40V40H36V36ZM24 44H28V48H24V44ZM36 44H40V48H36V44Z"
      fill="currentColor"
    />
  </svg>
)

export { FeaturePharmIcon }
