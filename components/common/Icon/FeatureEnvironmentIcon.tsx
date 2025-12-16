import React from 'react'

interface FeatureEnvironmentIconProps extends React.ComponentProps<'svg'> {
  className?: string
}

const FeatureEnvironmentIcon = ({
  className,
  ...props
}: FeatureEnvironmentIconProps) => (
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
      d="M32 6C31.448 6 31 6.448 31 7V10.142C22.331 10.653 15.347 16.486 13.371 24.371C8.973 25.869 6 30.045 6 35C6 41.075 10.925 46 17 46H30V36.414L25.707 40.707L24.293 39.293L31 32.586V7C31 6.448 31.448 6 32 6ZM33 7V32.586L39.707 39.293L38.293 40.707L34 36.414V46H47C53.075 46 58 41.075 58 35C58 30.045 55.027 25.869 50.629 24.371C48.653 16.486 41.669 10.653 33 10.142V7ZM32 14C39.732 14 46 20.268 46 28H48C52.418 28 56 31.582 56 36C56 40.418 52.418 44 48 44H34V48H30V44H16C11.582 44 8 40.418 8 36C8 31.582 11.582 28 16 28H18C18 20.268 24.268 14 32 14ZM17 50C14.791 50 13 51.791 13 54C13 56.209 14.791 58 17 58H47C49.209 58 51 56.209 51 54C51 51.791 49.209 50 47 50H17Z"
      fill="currentColor"
    />
  </svg>
)

export { FeatureEnvironmentIcon }
