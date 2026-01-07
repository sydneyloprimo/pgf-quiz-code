import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { StepCard } from './StepCard'
import { ValuePropCard } from './ValuePropCard'

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
    <section className="relative w-full bg-neutral-400 px-5 lg:px-24 py-16 lg:py-[200px] flex flex-col gap-12 items-center justify-center">
      {/* Background Image */}
      <div className="absolute h-[1362px] left-1/2 top-0 -translate-x-1/2 w-[2019.219px] pointer-events-none">
        <Image
          src="/images/formulation/research-bg-new.png"
          alt={t('backgroundAlt')}
          fill
          className="object-cover object-center opacity-10"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col gap-[60px] items-start w-full">
        {/* Header Section */}
        <div className="flex flex-col gap-2.5 w-full">
          <h2 className="font-display text-5xl lg:text-6xl leading-[56px] tracking-[-0.48px] text-quaternary-800 not-italic">
            {t('title')}
          </h2>
          <p className="font-sans text-lg leading-7 text-quaternary-800">
            {t('description1')}
          </p>
          <p className="font-sans text-lg leading-7 text-quaternary-800">
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
      <div className="relative z-10 flex flex-col gap-10 items-start w-full">
        {steps.map((step, index) => (
          <StepCard key={index} {...step} />
        ))}
      </div>
    </section>
  )
}

export { ClinicalResearchSection }
