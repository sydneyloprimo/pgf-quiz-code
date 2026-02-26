import { ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface FeatureBoxProps {
  icon: ReactNode
  title: string
  description?: string
  isEven: boolean
  titleClassName?: string
  orderClassName?: string
}

const FeatureBox = ({
  icon,
  title,
  description,
  isEven,
  titleClassName,
  orderClassName,
}: FeatureBoxProps) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center px-6 py-5 gap-8 min-h-[442px]',
      isEven ? 'bg-neutral-400' : 'bg-neutral-300 border border-neutral-500',
      orderClassName
    )}
  >
    <div className="flex h-20 w-20 shrink-0 items-center justify-center text-tertiary-800">
      <span className="size-20 [&>*]:size-full [&>*]:object-contain">
        {icon}
      </span>
    </div>
    <div className="flex flex-col gap-4 text-center">
      <h3
        className={cn(
          'font-display',
          'text-xl md:text-2xl',
          'leading-8',
          'text-secondary-950',
          titleClassName
        )}
      >
        {title}
      </h3>
      {description && (
        <p className="font-sans text-base leading-6 text-secondary-900">
          {description}
        </p>
      )}
    </div>
  </div>
)

export { FeatureBox }
export type { FeatureBoxProps }
