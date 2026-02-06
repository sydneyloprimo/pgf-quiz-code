import { useTranslations } from 'next-intl'

import { ContentfulImage } from '@/components/common/ContentfulImage'
import { StepCard } from '@/components/home/HowItWorksSection/StepCard'
import { HOW_IT_WORKS_STEPS } from '@/constants'
import { cn } from '@/utils/cn'

const HowItWorksSection = () => {
  const t = useTranslations('Home.HowItWorks')

  const steps = HOW_IT_WORKS_STEPS.map((step) => ({
    stepNumber: step.stepNumber,
    title: t(step.titleKey),
    description: t(step.descriptionKey),
  }))

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
        <ContentfulImage
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
            'font-display',
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
          {steps.map((step, index) => (
            <StepCard
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { HowItWorksSection }
