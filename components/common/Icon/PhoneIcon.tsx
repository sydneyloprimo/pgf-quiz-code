import React from 'react'

interface PhoneIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const PhoneIcon = ({ className, ...props }: PhoneIconProps) => (
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
      d="M5.52 2.5C5.58 3.36 5.74 4.2 6 5L4.78 6.22C4.33 5.08 4.05 3.82 3.97 2.5H5.52ZM14.99 14.01C15.81 14.27 16.65 14.43 17.5 14.49V16.02C16.18 15.94 14.92 15.67 13.77 15.23L14.99 14.01ZM6.5 1H3C2.45 1 2 1.45 2 2C2 10.84 9.16 18 18 18C18.55 18 19 17.55 19 17V13.51C19 12.96 18.55 12.51 18 12.51C16.76 12.51 15.56 12.31 14.43 11.94C14.33 11.91 14.22 11.89 14.12 11.89C13.86 11.89 13.61 11.99 13.41 12.18L11.21 14.38C8.38 12.93 6.06 10.62 4.62 7.79L6.82 5.59C7.1 5.31 7.18 4.92 7.07 4.57C6.7 3.45 6.5 2.24 6.5 1Z"
      fill="currentColor"
    />
  </svg>
)

export { PhoneIcon }
