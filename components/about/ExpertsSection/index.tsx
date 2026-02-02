import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { EXPERT_ITEMS } from '@/constants'
import type { ExpertsSectionContent } from '@/contentful/experts'
import { cn } from '@/utils/cn'

interface ExpertsSectionProps {
  content?: ExpertsSectionContent | null
}

const ExpertsSection = ({ content }: ExpertsSectionProps) => {
  const t = useTranslations('About.Experts')

  const fromContentful = content && content.experts.length > 0
  const title = fromContentful ? content.title : t('title')
  const ecvcn1 = fromContentful ? content.ecvcnParagraph1 : t('ecvcnParagraph1')
  const ecvcn2 = fromContentful ? content.ecvcnParagraph2 : t('ecvcnParagraph2')
  const ecvcn3 = fromContentful ? content.ecvcnParagraph3 : t('ecvcnParagraph3')

  const experts = fromContentful
    ? content.experts.map((expert, index) => ({
        id: `contentful-${index}`,
        imageSrc: expert.imageUrl ?? '',
        imageAlt: expert.imageAlt,
        name: expert.name,
        description: expert.description,
      }))
    : EXPERT_ITEMS.map((item) => ({
        id: item.id,
        imageSrc: item.imageSrc,
        imageAlt: t(item.imageAltKey),
        name: t(item.nameKey),
        description: t(item.descriptionKey),
      }))

  return (
    <section className="w-full bg-neutral-400 flex flex-col items-center px-5 md:px-24 py-20 md:py-28">
      <div className="w-full flex flex-col gap-40 items-center">
        <div className="w-full flex flex-col gap-20 items-center">
          <h2
            className={cn(
              'font-display',
              'text-3xl md:text-4xl leading-12 tracking-tight',
              'text-secondary-950 text-center w-full'
            )}
          >
            {title}
          </h2>
          <div className="flex flex-col md:flex-row gap-10 items-start justify-center w-full">
            {experts.map((expert) => (
              <div
                key={expert.id}
                className="flex flex-col gap-6 items-center justify-center max-w-full md:max-w-96 w-full isolate"
              >
                {expert.imageSrc ? (
                  <div className="relative w-full h-96 md:h-140 z-20">
                    <Image
                      src={expert.imageSrc}
                      alt={expert.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 388px"
                    />
                    <div
                      className="absolute inset-0 bg-secondary-950 opacity-41 mix-blend-color"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
                <div className="flex flex-col gap-4 items-start justify-center max-w-full md:max-w-lg w-full z-10">
                  <h5 className="font-display italic text-xl md:text-2xl leading-8 text-secondary-950 min-w-full w-min">
                    {expert.name}
                  </h5>
                  <p className="font-sans text-base leading-6 text-secondary-950 w-full">
                    {expert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="font-display font-normal text-xl md:text-2xl leading-8 text-secondary-950 text-center w-full max-w-4xl">
          {ecvcn1}
          {ecvcn2}
          {ecvcn3}
        </p>
      </div>
    </section>
  )
}

export { ExpertsSection }
