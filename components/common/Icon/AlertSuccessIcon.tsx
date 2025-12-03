import React from 'react'

interface AlertSuccessIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const AlertSuccessIcon = ({ className, ...props }: AlertSuccessIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M8 11L10 13L14 9M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export { AlertSuccessIcon }
