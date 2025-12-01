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
              'font-semibold text-xl leading-8',
              isSelected
                ? 'bg-secondary-100 border-2 border-secondary-600 text-secondary-600'
                : 'bg-neutral-white border border-tertiary-300 text-tertiary-800 hover:bg-secondary-200 hover:border-tertiary-300 hover:text-tertiary-800 focus:bg-secondary-200 focus:border-tertiary-300 focus:text-tertiary-800 active:bg-secondary-200 active:border-tertiary-300 active:text-tertiary-800'
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
