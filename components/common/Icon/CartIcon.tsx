import React from 'react'

interface CartIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const CartIcon = ({ className, ...props }: CartIconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M1.66667 1.66667H3.33333L3.5 2.5M4.16667 6.66667H16.6667L13.3333 12.5H5.83333M4.16667 6.66667L3.5 2.5M4.16667 6.66667L5.83333 12.5M3.5 2.5H16.6667M5.83333 12.5L4.16667 15.8333H15M6.66667 18.3333C6.66667 18.7936 6.29357 19.1667 5.83333 19.1667C5.3731 19.1667 5 18.7936 5 18.3333C5 17.8731 5.3731 17.5 5.83333 17.5C6.29357 17.5 6.66667 17.8731 6.66667 18.3333ZM15 18.3333C15 18.7936 14.6269 19.1667 14.1667 19.1667C13.7064 19.1667 13.3333 18.7936 13.3333 18.3333C13.3333 17.8731 13.7064 17.5 14.1667 17.5C14.6269 17.5 15 17.8731 15 18.3333Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export { CartIcon }
