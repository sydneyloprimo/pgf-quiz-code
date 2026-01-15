import { useTranslations } from 'next-intl'

const HeroSection = () => {
  const t = useTranslations('About.Hero')

  return (
    <section className="relative w-full flex flex-col items-center justify-center px-5 md:px-24 py-16 md:py-24 bg-neutral-400 border-b border-neutral-800 overflow-hidden">
      <div className="relative z-10 flex flex-col gap-2 md:gap-8 items-center text-center max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl xl:text-6xl leading-tight tracking-tight text-secondary-950">
          {t('title')}
        </h1>
        <p className="font-sans text-base leading-6 text-secondary-900">
          {t('subtitle')}
        </p>
      </div>
    </section>
  )
}

export { HeroSection }
