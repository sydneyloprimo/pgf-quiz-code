import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { ProgressBar } from './ProgressBar'

import { Button } from '@/components/common/Button'
import { ArrowLeftIcon, CloseIcon, PGFTextLogo } from '@/components/common/Icon'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

interface QuizHeaderProps {
  visitedSteps: number
  showProgressBar?: boolean
  centerLogo?: boolean
  showBackButton?: boolean
  onBack?: () => void
}

const QuizHeader = ({
  visitedSteps,
  showProgressBar = true,
  centerLogo = false,
  showBackButton = false,
  onBack,
}: QuizHeaderProps) => {
  const t = useTranslations('Quiz')

  const handleBackClick = () => {
    onBack?.()
  }

  return (
    <header className="bg-neutral-300">
      <div
        className={cn(
          'flex items-center',
          centerLogo ? 'justify-center relative' : 'justify-between',
          'px-5 sm:px-24 pb-4'
        )}
      >
        {showBackButton ? (
          <Button
            type="button"
            variant="tertiary"
            onClick={handleBackClick}
            data-qa="quiz-back-button"
            leftIcon={<ArrowLeftIcon className="size-3.5" />}
            className={cn(
              'h-10 w-10 p-0 cursor-pointer',
              'absolute left-5 sm:left-24'
            )}
            aria-label={t('backButton')}
          />
        ) : (
          <Link href={Routes.home} data-qa="quiz-logo">
            <PGFTextLogo
              className="h-9 w-56 text-neutral-950"
              aria-label={t('title')}
            />
          </Link>
        )}
        {centerLogo && (
          <Link href={Routes.home} data-qa="quiz-logo">
            <PGFTextLogo
              className="h-9 w-56 text-neutral-950"
              aria-label={t('title')}
            />
          </Link>
        )}
        <Button
          variant="tertiary"
          href={Routes.home}
          data-qa="quiz-close-button"
          leftIcon={<CloseIcon className="size-3.5" />}
          className={cn(
            'h-10 w-10 p-0',
            centerLogo && 'absolute right-5 sm:right-24'
          )}
          aria-label={t('closeButton')}
        />
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
