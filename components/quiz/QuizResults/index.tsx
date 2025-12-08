'use client'

import { useWatch, UseFormReturn } from 'react-hook-form'

import { PromiseOfCareAlert } from '@/components/common/PromiseOfCareAlert'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizResultsHeader } from '@/components/quiz/QuizResultsHeader'
import { QuizStep } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizResultsProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const QuizResults = ({ formMethods }: QuizResultsProps) => {
  const { control } = formMethods

  const formData = useWatch({ control }) as QuizFormData

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'px-0 pb-12 w-full',
        'gap-16'
      )}
    >
      <QuizResultsHeader formData={formData} />

      <div className="w-full">
        <PromiseOfCareAlert />
      </div>
    </div>
  )
}

export { QuizResults }
