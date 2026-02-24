import { useTranslations } from 'next-intl'

import { STEP_STATIC_DATA, VALUE_PROP_COUNT } from './constants'
import { StepCard } from './StepCard'
import { ValuePropCard } from './ValuePropCard'

import {
  FORMULATION_SECTION_PADDING_X,
  FORMULATION_SECTION_PADDING_Y,
} from '@/constants'
import { cn } from '@/utils/cn'

const ClinicalResearchSection = () => {
  const t = useTranslations('Formulation.Research')

  const valueProps = Array.from({ length: VALUE_PROP_COUNT }, (_, i) => {
    const index = i + 1
    return {
      title: t(`valueProp${index}Title`),
      description: t(`valueProp${index}Description`),
    }
  })

  const steps = STEP_STATIC_DATA.map((staticData, i) => {
    const index = i + 1
    return {
      title: t(`step${index}Title`),
      description1: t(`step${index}Description1`),
      description2: t(`step${index}Description2`),
      imageSrc: staticData.imageSrc,
      imageRotation: staticData.imageRotation,
      imagePosition: staticData.imagePosition,
    }
  })

  return (
    <section
      className={cn(
        'relative w-full bg-neutral-400 flex flex-col gap-12 items-center justify-center overflow-hidden bg-[url(/images/home/clinically-approved-bg.svg)] bg-no-repeat bg-[position:right_top] bg-[length:auto_25%] md:bg-[length:auto_35%] lg:bg-[length:auto_45%]',
        FORMULATION_SECTION_PADDING_X,
        FORMULATION_SECTION_PADDING_Y
      )}
    >
      {/* Main Content */}
      <div className="relative z-10 flex flex-col gap-16 items-start w-full">
        {/* Header Section */}
        <div className="flex flex-col gap-6 w-full">
          <h2 className="heading-h2 tracking-tight text-quaternary-800 not-italic">
            {t('title')}
          </h2>
          <p className="font-sans text-lg leading-normal text-quaternary-800">
            {t('description1')}
          </p>
        </div>

        {/* Value Prop Cards */}
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          {valueProps.map((prop, index) => (
            <ValuePropCard key={index} {...prop} />
          ))}
        </div>
      </div>

      {/* Step Cards + Disclaimer: same tight spacing between boxes and before disclaimer */}
      <div className="relative z-10 flex flex-col gap-8 pt-6 items-start w-full">
        <div className="flex flex-col gap-8 items-start w-full">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>
        <div className="w-full px-5 lg:px-0">
          <p className="font-sans text-lg leading-7 text-neutral-950 lg:text-quaternary-800">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </section>
  )
}

export { ClinicalResearchSection }
