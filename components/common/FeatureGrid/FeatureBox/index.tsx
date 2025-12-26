import { ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface FeatureBoxProps {
  icon: ReactNode
  title: string
  description?: string
  isEven: boolean
  titleClassName?: string
}

const FeatureBox = ({
  icon,
  title,
  description,
  isEven,
  titleClassName,
}: FeatureBoxProps) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center',
      'px-6 py-5 gap-8',
      'aspect-square md:aspect-auto md:min-h-80',
      isEven ? 'bg-neutral-400' : 'bg-neutral-300 border border-neutral-500'
    )}
  >
    <div className="flex items-center justify-center h-12 text-tertiary-800">
      {icon}
    </div>
    <div className="flex flex-col gap-4 text-center">
      <h3
        className={cn(
          'font-display font-bold',
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
