import React from 'react'

interface FeatureCommunityIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const FeatureCommunityIcon = ({
  className,
  ...props
}: FeatureCommunityIconProps) => (
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
      d="M32 8C27.582 8 24 11.582 24 16C24 20.418 27.582 24 32 24C36.418 24 40 20.418 40 16C40 11.582 36.418 8 32 8ZM16 16C12.686 16 10 18.686 10 22C10 25.314 12.686 28 16 28C19.314 28 22 25.314 22 22C22 18.686 19.314 16 16 16ZM48 16C44.686 16 42 18.686 42 22C42 25.314 44.686 28 48 28C51.314 28 54 25.314 54 22C54 18.686 51.314 16 48 16ZM32 26C25.373 26 20 31.373 20 38V44H44V38C44 31.373 38.627 26 32 26ZM16 30C10.477 30 6 34.477 6 40V44H18V38C18 35.239 18.835 32.672 20.262 30.529C18.953 30.192 17.499 30 16 30ZM48 30C46.501 30 45.047 30.192 43.738 30.529C45.165 32.672 46 35.239 46 38V44H58V40C58 34.477 53.523 30 48 30ZM20 48V56H44V48H20ZM6 48V54H18V48H6ZM46 48V54H58V48H46Z"
      fill="currentColor"
    />
  </svg>
)

export { FeatureCommunityIcon }
