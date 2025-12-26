import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

interface ValuePropCardProps {
  title: string
  description: string
}

const ValuePropCard = ({ title, description }: ValuePropCardProps) => (
  <div
    className={cn(
      'bg-neutral-300',
      'border border-quaternary-500',
      'flex flex-col',
      'px-12 py-15',
      'flex-1'
    )}
  >
    <div className="flex flex-col">
      <div className="flex flex-col gap-4">
        <div
          className={cn('h-12', 'border-l border-quaternary-500')}
          aria-hidden="true"
        />
        <h3
          className={cn(
            'font-display',
            'text-2xl',
            'leading-8',
            'text-quaternary-800',
            'whitespace-pre-line'
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'font-sans',
            'text-base',
            'leading-6',
            'text-quaternary-800'
          )}
        >
          {description}
        </p>
      </div>
    </div>
  </div>
)

interface StepCardProps {
  number: string
  title: string
  description1: string
  description2: string
  imageSrc: string
  imageRotation: number
  imagePosition: {
    bottom: string
    left: string
  }
}

const StepCard = ({
  number,
  title,
  description1,
  description2,
  imageSrc,
  imageRotation,
  imagePosition,
}: StepCardProps) => (
  <div
    className={cn(
      'bg-neutral-400',
      'flex flex-wrap gap-8',
      'py-0 lg:py-15 px-0',
      'relative',
      'overflow-clip'
    )}
  >
    <div
      className={cn(
        'bg-neutral-400',
        'flex flex-col items-center justify-start',
        'w-[204px]',
        'shrink-0',
        'pl-5 lg:pl-0'
      )}
    >
      <div
        className={cn(
          'font-display',
          'text-[100px]',
          'leading-[100px]',
          'text-quaternary-800',
          'text-center',
          'tracking-[-1px]'
        )}
      >
        {number}
      </div>
    </div>
    <div
      className={cn(
        'flex flex-1 flex-col gap-8',
        'items-center justify-center',
        'min-w-[393px]',
        'pb-0 lg:pb-12 pl-5 lg:pl-12 pr-[60px] pt-0',
        'relative'
      )}
    >
      <div className="flex flex-col gap-4 w-full">
        <h4
          className={cn(
            'font-display',
            'text-3xl',
            'leading-10',
            'tracking-[-0.32px]',
            'text-quaternary-800',
            'whitespace-pre-line'
          )}
        >
          {title}
        </h4>
        <div
          className={cn(
            'font-sans',
            'text-lg',
            'leading-7',
            'text-quaternary-800'
          )}
        >
          <p className="mb-2.5">{description1}</p>
          <p>{description2}</p>
        </div>
      </div>
      <div
        className="absolute"
        style={{
          bottom: imagePosition.bottom,
          left: imagePosition.left,
        }}
      >
        <div
          className="flex-none"
          style={{ transform: `rotate(${imageRotation}deg)` }}
        >
          <Image
            src={imageSrc}
            alt=""
            width={136}
            height={131}
            className="h-auto w-auto"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </div>
)

const ClinicalResearchSection = () => {
  const t = useTranslations('Formulation.Research')

  const valueProps = [
    {
      title: t('valueProp1Title'),
      description: t('valueProp1Description'),
    },
    {
      title: t('valueProp2Title'),
      description: t('valueProp2Description'),
    },
    {
      title: t('valueProp3Title'),
      description: t('valueProp3Description'),
    },
  ]

  const steps = [
    {
      number: t('step1Number'),
      title: t('step1Title'),
      description1: t('step1Description1'),
      description2: t('step1Description2'),
      imageSrc: '/images/formulation/step-decorative-1.svg',
      imageRotation: 46.375,
      imagePosition: {
        bottom: '0',
        left: '-165.2px',
      },
    },
    {
      number: t('step2Number'),
      title: t('step2Title'),
      description1: t('step2Description1'),
      description2: t('step2Description2'),
      imageSrc: '/images/formulation/step-decorative-2.svg',
      imageRotation: 138.211,
      imagePosition: {
        bottom: '-52.36px',
        left: '-151.68px',
      },
    },
    {
      number: t('step3Number'),
      title: t('step3Title'),
      description1: t('step3Description1'),
      description2: t('step3Description2'),
      imageSrc: '/images/formulation/step-decorative-3.svg',
      imageRotation: 215.447,
      imagePosition: {
        bottom: '-34.27px',
        left: '-174.68px',
      },
    },
  ]

  return (
    <section
      className={cn(
        'relative w-full',
        'bg-neutral-400',
        'px-5 lg:px-24',
        'py-16 lg:py-[200px]',
        'flex flex-col gap-12',
        'items-center justify-center'
      )}
    >
      {/* Background Image */}
      <div
        className={cn(
          'absolute',
          'h-[1362px]',
          'left-1/2',
          'top-0',
          '-translate-x-1/2',
          'w-[2019.219px]',
          'pointer-events-none'
        )}
      >
        <Image
          src="/images/formulation/research-bg-new.png"
          alt={t('backgroundAlt')}
          fill
          className="object-cover object-center opacity-10"
        />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'relative z-10',
          'flex flex-col gap-[60px]',
          'items-start',
          'w-full'
        )}
      >
        {/* Header Section */}
        <div className="flex flex-col gap-2.5 w-full">
          <h2
            className={cn(
              'font-display',
              'text-5xl lg:text-6xl',
              'leading-[56px]',
              'tracking-[-0.48px]',
              'text-quaternary-800',
              'not-italic'
            )}
          >
            {t('title')}
          </h2>
          <p
            className={cn(
              'font-sans',
              'text-lg',
              'leading-7',
              'text-quaternary-800'
            )}
          >
            {t('description1')}
          </p>
          <p
            className={cn(
              'font-sans',
              'text-lg',
              'leading-7',
              'text-quaternary-800'
            )}
          >
            {t('description2')}
          </p>
        </div>

        {/* Value Prop Cards */}
        <div className="flex flex-col lg:flex-row gap-[19px] w-full">
          {valueProps.map((prop, index) => (
            <ValuePropCard key={index} {...prop} />
          ))}
        </div>
      </div>

      {/* Step Cards */}
      <div
        className={cn(
          'relative z-10',
          'flex flex-col gap-10',
          'items-start',
          'w-full'
        )}
      >
        {steps.map((step, index) => (
          <StepCard key={index} {...step} />
        ))}
      </div>
    </section>
  )
}

export { ClinicalResearchSection }
