import { useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'

interface ClinicalTakeawayProps extends PropsWithChildren {}

const ClinicalTakeaway = ({ children }: ClinicalTakeawayProps) => {
  const t = useTranslations('BlogPostPage')

  return (
    <section className="my-8">
      <h2 className="font-display text-xl leading-normal text-black mb-4">
        {t('clinicalTakeaway')}
      </h2>
      <div className="font-sans text-lg leading-normal text-black">
        {children}
      </div>
    </section>
  )
}

export { ClinicalTakeaway }
