import Image from 'next/image'
import { useTranslations } from 'next-intl'

const RecipesHeroSection = () => {
  const t = useTranslations('Recipes.Hero')

  return (
    <section className="relative w-full py-12 px-5 md:px-24 bg-neutral-100 flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative Logo */}
      <div className="absolute top-8 right-8 opacity-10 hidden md:block">
        <Image
          src="/images/logo-decorative.svg"
          alt=""
          width={200}
          height={200}
          aria-hidden="true"
        />
      </div>

      {/* Clinically Approved Decoration */}
      <div className="flex justify-center mb-6">
        <Image
          src="/icons/clinically-approved-decoration.svg"
          alt=""
          width={160}
          height={55}
          aria-hidden="true"
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
