import { ReactNode } from 'react'

import { FeatureBox } from '@/components/common/FeatureGrid/FeatureBox'
import { FeatureBoxSpecial } from '@/components/common/FeatureGrid/FeatureBoxSpecial'
import { cn } from '@/utils/cn'

export interface FeatureItem {
  icon?: ReactNode
  title?: string
  description?: string
  type?: 'special'
  titleClassName?: string
  orderClassName?: string
}

interface FeatureGridProps {
  features: FeatureItem[]
  columns?: 2 | 3
  className?: string
}

const FeatureGrid = ({
  features,
  columns = 3,
  className,
}: FeatureGridProps) => {
  const gridColsClass = columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('grid grid-cols-1 w-full', gridColsClass)}>
        {features.map((feature, index) => {
          const isEven =
            columns === 2
              ? (Math.floor(index / 2) + (index % 2)) % 2 === 1
              : index % 2 === 1

          if (feature.type === 'special') {
            return <FeatureBoxSpecial key={index} isEven={isEven} />
          }

          if (!feature.icon || !feature.title) {
            return null
          }

          return (
            <FeatureBox
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              isEven={isEven}
              titleClassName={feature.titleClassName}
              orderClassName={feature.orderClassName}
            />
          )
        })}
      </div>
    </div>
  )
}

export { FeatureGrid }
export type { FeatureGridProps }
