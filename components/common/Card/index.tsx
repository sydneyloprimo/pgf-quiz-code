import cn from 'classnames'
import { PropsWithChildren } from 'react'

interface CardProps extends PropsWithChildren {
  className?: string
}

const Card = ({ children, className }: CardProps) => (
  <div
    className={cn(
      className,
      'w-[360px] bg-white text-black px-8 py-10 rounded-lg'
    )}
  >
    {children}
  </div>
)

export default Card
