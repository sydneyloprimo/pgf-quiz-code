import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { ProgressBar } from './ProgressBar'

import { CloseIcon, PGFTextLogo } from '@/components/common/Icon'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

interface QuizHeaderProps {
  visitedSteps: number
  showProgressBar?: boolean
  centerLogo?: boolean
}

const QuizHeader = ({
  visitedSteps,
  showProgressBar = true,
  centerLogo = false,
}: QuizHeaderProps) => {
  const t = useTranslations('Quiz')

  return (
    <header className="bg-neutral-300">
      <div
        className={cn(
          'flex items-center',
          centerLogo ? 'justify-center relative' : 'justify-between',
          'px-5 sm:px-24 pb-4'
        )}
      >
        <Link href={Routes.home} data-qa="quiz-logo">
          <PGFTextLogo
            className="h-9 w-56 text-neutral-950"
            aria-label={t('title')}
          />
        </Link>
        <Link
          href={Routes.home}
          data-qa="quiz-close-button"
          className={cn(
            'bg-neutral-white border border-secondary-900',
            'flex items-center justify-center',
            'h-10 w-10 p-3',
            'cursor-pointer',
            centerLogo && 'absolute right-5 sm:right-24'
          )}
          aria-label={t('closeButton')}
        >
          <CloseIcon className="size-6 text-secondary-900" />
        </Link>
      </div>
      {showProgressBar && (
        <div className="px-5 md:px-24 pb-4">
          <ProgressBar visitedSteps={visitedSteps} />
        </div>
      )}
    </header>
  )
}

export { QuizHeader }
