'use client'

import { Button } from '@/components/common/Button'
import { cn } from '@/utils/cn'

interface Option {
  label: string
  value: string
}

interface OptionSelectProps {
  options: Option[]
  value?: string
  onSelect: (value: string) => void
  className?: string
}

const OptionSelect = ({
  options,
  value,
  onSelect,
  className,
}: OptionSelectProps) => {
  return (
    <div className={cn('flex flex-col gap-4 w-full', className)}>
      {options.map((option) => {
        const isSelected = value === option.value

        return (
          <Button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              'w-full justify-center',
              'font-display font-semibold text-2xl leading-8',
              'rounded-md',
              isSelected
                ? 'bg-secondary-200 border border-secondary-600 text-secondary-950'
                : 'bg-neutral-white border border-tertiary-300 text-secondary-950 hover:bg-secondary-200 hover:border-secondary-600 hover:text-secondary-950 focus:bg-secondary-200 focus:border-secondary-600 focus:text-secondary-950'
            )}
            variant="ghost"
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}

export { OptionSelect }
export type { OptionSelectProps, Option }





