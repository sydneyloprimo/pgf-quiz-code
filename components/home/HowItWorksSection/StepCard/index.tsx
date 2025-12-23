import { cn } from '@/utils/cn'

interface StepCardProps {
  stepNumber: number
  title: string
  description: string
  isLast?: boolean
  isFirst?: boolean
}

const StepCard = ({
  stepNumber,
  title,
  description,
  isLast = false,
  isFirst = false,
}: StepCardProps) => (
  <div
    className={cn(
      'relative',
      'flex flex-col md:flex-row items-start md:items-center',
      'w-full py-11',
      'border-b border-quaternary-500'
    )}
  >
    {/* Vertical Divider Line (Desktop) */}
    {!isFirst && (
      <div
        className={cn(
          'absolute',
          'top-0 left-16 h-8',
          'w-px bg-quaternary-500'
        )}
        aria-hidden="true"
      />
    )}
    {/* Step Number */}
    <div className="w-32 shrink-0 flex items-center justify-center">
      <span
        className={cn(
          'font-display',
          'text-7xl md:text-8xl',
          'leading-none tracking-tight',
          'text-quaternary-200'
        )}
      >
        {stepNumber}
      </span>
    </div>

    {/* Content */}
    <div className="flex-1 flex flex-col gap-4 pl-0 md:pl-8 pr-0 md:pr-16 pt-4 md:pt-0">
      <h3
        className={cn(
          'font-display',
          'text-2xl md:text-3xl',
          'leading-tight md:leading-10',
          'tracking-tight',
          'text-neutral-white'
        )}
      >
        {title}
      </h3>
      <p className="font-sans text-lg leading-7 text-quaternary-100">
        {description}
      </p>
    </div>
  </div>
)

export { StepCard }
export type { StepCardProps }
