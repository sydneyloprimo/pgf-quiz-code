import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { ProgressBar } from './ProgressBar'

import { CloseIcon, PGFTextLogo } from '@/components/common/Icon'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

interface QuizHeaderProps {
  visitedSteps: number
}

const QuizHeader = ({ visitedSteps }: QuizHeaderProps) => {
  const t = useTranslations('Quiz')

  return (
    <header className="bg-neutral-300">
      <div
        className={cn(
          'flex items-center justify-between',
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
            'cursor-pointer'
          )}
          aria-label={t('closeButton')}
        >
          <CloseIcon className="size-6 text-secondary-900" />
        </Link>
      </div>
      <div className="px-5 md:px-24 pb-4">
        <ProgressBar visitedSteps={visitedSteps} />
      </div>
    </header>
  )
}

export { QuizHeader }
