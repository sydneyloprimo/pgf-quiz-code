import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

interface StepCardProps {
  stepNumber: number
  title: string
  description: string
  isLast?: boolean
}

const StepCard = ({
  stepNumber,
  title,
  description,
  isLast = false,
}: StepCardProps) => (
  <div
    className={cn(
      'flex flex-col md:flex-row items-start md:items-center',
      'w-full py-11',
      !isLast && 'border-b border-quaternary-500'
    )}
  >
    {/* Step Number */}
    <div className="w-32 shrink-0 flex items-center justify-center">
      <span
        className={cn(
          'font-display font-semibold',
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
          'font-display font-semibold',
          'text-2xl md:text-3xl',
          'leading-tight md:leading-10',
          'tracking-tight',
          'text-neutral-white'
        )}
      >
        {title}
      </h3>
      <p className={cn('font-sans text-lg leading-7', 'text-quaternary-100')}>
        {description}
      </p>
    </div>
  </div>
)

const HowItWorksSection = () => {
  const t = useTranslations('Home.HowItWorks')

  const steps = [
    {
      stepNumber: 1,
      title: t('step1Title'),
      description: t('step1Description'),
    },
    {
      stepNumber: 2,
      title: t('step2Title'),
      description: t('step2Description'),
    },
    {
      stepNumber: 3,
      title: t('step3Title'),
      description: t('step3Description'),
    },
  ]

  return (
    <section
      className={cn(
        'w-full',
        'bg-quaternary-800',
        'relative overflow-hidden',
        'px-5 md:px-24',
        'pt-24 md:pt-24 pb-32 md:pb-36'
      )}
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image
          src="/images/home/how-it-works-texture.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-12">
        <h2
          className={cn(
            'font-display font-semibold',
            'text-4xl md:text-5xl',
            'leading-tight md:leading-14',
            'tracking-tight',
            'text-neutral-white'
          )}
        >
          {t('title')}
        </h2>

        {/* Steps */}
        <div className="flex flex-col relative">
          {/* Vertical Divider Line (Desktop) */}
          <div
            className={cn(
              'hidden md:block',
              'absolute left-16 top-20 bottom-24',
              'w-px bg-quaternary-500'
            )}
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <StepCard
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { HowItWorksSection }
