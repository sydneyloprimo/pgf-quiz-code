import Image from 'next/image'
import { useTranslations } from 'next-intl'

const RecipesHeroSection = () => {
  const t = useTranslations('Recipes.Hero')

  return (
    <section className="relative w-full py-12 px-5 md:px-24 bg-neutral-100 flex flex-col items-center justify-center overflow-hidden">
      {/* Clinically Approved Decoration */}
      <div className="flex justify-center mb-6 relative w-40 h-14">
        <Image
          src="/icons/recipes-decoration.svg"
          alt={t('clinicallyApprovedAlt')}
          width={160}
          height={55}
        />
      </div>

      {/* Title */}
      <h1 className="font-display text-4xl md:text-6xl font-normal text-tertiary-800 text-center tracking-tight">
        {t('title')}
      </h1>
    </section>
  )
}

export { RecipesHeroSection }
