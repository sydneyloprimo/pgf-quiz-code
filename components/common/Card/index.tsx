import cn from 'classnames'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  className?: string
}

const Card = ({ children, header, footer, className }: CardProps) => {
  return (
    <div
      className={cn(
        className,
        'w-[360px] bg-white text-black px-8 py-10 rounded-lg'
      )}
    >
      {header}
      {children}
      {footer}
    </div>
  )
}

export default Card
