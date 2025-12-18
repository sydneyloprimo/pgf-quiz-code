'use client'

import React, { useId } from 'react'

interface ShoppingCartIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const ShoppingCartIcon = ({ className, ...props }: ShoppingCartIconProps) => {
  const clipId = useId()

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M0.833984 0.833336H4.16732L6.40065 11.9917C6.47686 12.3753 6.68557 12.72 6.99027 12.9653C7.29497 13.2105 7.67623 13.3408 8.06732 13.3333H16.1673C16.5584 13.3408 16.9397 13.2105 17.2444 12.9653C17.5491 12.72 17.7578 12.3753 17.834 11.9917L19.1673 5H5.00065M8.33398 17.5C8.33398 17.9602 7.96089 18.3333 7.50065 18.3333C7.04041 18.3333 6.66732 17.9602 6.66732 17.5C6.66732 17.0398 7.04041 16.6667 7.50065 16.6667C7.96089 16.6667 8.33398 17.0398 8.33398 17.5ZM17.5007 17.5C17.5007 17.9602 17.1276 18.3333 16.6673 18.3333C16.2071 18.3333 15.834 17.9602 15.834 17.5C15.834 17.0398 16.2071 16.6667 16.6673 16.6667C17.1276 16.6667 17.5007 17.0398 17.5007 17.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export { ShoppingCartIcon }
