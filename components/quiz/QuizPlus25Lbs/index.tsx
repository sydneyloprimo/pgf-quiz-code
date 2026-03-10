'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/common/Button'
import { ArrowLeftIcon } from '@/components/common/Icon'
import { WaitlistModal } from '@/components/common/WaitlistModal'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { useModal } from '@/hooks/useModal'
import { QuizStep } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizPlus25LbsProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const QuizPlus25Lbs = ({
  goToStep,
  goBack,
  canGoBack,
  formMethods,
}: QuizPlus25LbsProps) => {
  const t = useTranslations('Quiz.plus25Lbs')
  const { isOpen, openModal, closeModal } = useModal()
  const quizFormData = formMethods.getValues()

  const handleChangeWeight = useCallback(() => {
    goToStep(QuizStep.PetInfo)
  }, [goToStep])

  return (
    <>
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          'py-12 w-full',
          'gap-16'
        )}
      >
        <div className="flex flex-col gap-6 items-center text-center w-full text-secondary-950 max-w-2xl">
          <h2 className="font-display text-4xl leading-12 tracking-tight w-full">
            {t('heading')}
          </h2>
          <p className="font-body text-xl leading-8 w-full">
            {t('description')}
          </p>
        </div>
        <div
          className={cn(
            'flex flex-col md:flex-row',
            'items-center justify-center gap-4',
            'w-full'
          )}
        >
          <Button
            type="button"
            onClick={handleChangeWeight}
            variant="tertiary"
            leftIcon={<ArrowLeftIcon className="size-5" />}
            className="w-full md:w-auto md:order-1 order-2"
          >
            {t('changeWeightsButton')}
          </Button>
          <Button
            type="button"
            onClick={openModal}
            variant="primary"
            className="w-full md:w-auto md:min-w-64 md:order-2 order-1"
          >
            {t('joinWaitlistButton')}
          </Button>
        </div>
      </div>
      <WaitlistModal
        isOpen={isOpen}
        onClose={closeModal}
        quizFormData={quizFormData}
        waitlistSegment="weight"
      />
    </>
  )
}

export { QuizPlus25Lbs }
