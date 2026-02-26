import { Button } from '@/components/common/Button'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

interface BostonAnnouncementContentProps {
  title: string
  description1: string
  description2: string
  ctaLabel: string
  onCtaClick: () => void
  variant: 'mobile' | 'desktop'
}

const BostonAnnouncementContent = ({
  title,
  description1,
  description2,
  ctaLabel,
  onCtaClick,
  variant,
}: BostonAnnouncementContentProps) => {
  const isMobile = variant === 'mobile'

  return (
    <div
      className={cn(
        'flex flex-col gap-8',
        isMobile
          ? 'w-full px-5 py-6 items-center text-center'
          : 'absolute inset-0 z-10 px-20 py-16 items-start justify-center'
      )}
    >
      <div className={cn('flex flex-col gap-4', !isMobile && 'max-w-md')}>
        <h2
          className={cn(
            'font-display heading-h2 leading-tight tracking-tight',
            isMobile ? 'text-secondary-950' : 'text-white'
          )}
        >
          {title}
        </h2>
        <div
          className={cn(
            'font-sans',
            isMobile
              ? 'text-body-m text-secondary-950'
              : 'text-body-m text-white'
          )}
        >
          <p className="mb-2">{description1}</p>
          <p>{description2}</p>
        </div>
      </div>

      <Button variant="secondary" href={Routes.quiz}>
        {ctaLabel}
      </Button>
    </div>
  )
}

export { BostonAnnouncementContent }
