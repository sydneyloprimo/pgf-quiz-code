'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { useConciergeContact } from '@/hooks/useConciergeContact'

const VetNutritionistCTA = () => {
  const t = useTranslations('Home.VetNutritionist')
  const { href } = useConciergeContact()

  return (
    <section className="w-full bg-quaternary-800 relative overflow-hidden px-5 md:px-24 py-36 md:py-40">
      {/* Background Texture */}
      <div className="absolute inset-0 mix-blend-overlay opacity-70 pointer-events-none">
        <Image
          src="/images/home/vet-nutritionist-texture.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 md:gap-16 max-w-2xl mx-auto text-center">
        <div className="flex flex-col gap-6 items-center">
          <h2 className="font-display text-3xl md:text-4xl leading-tight md:leading-12 tracking-tight text-neutral-white">
            {t('title')}
          </h2>
          <p className="font-sans text-lg md:text-xl leading-7 md:leading-8 text-neutral-white max-w-lg">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-11">
          <Link
            href="/quiz"
            className="font-sans text-base leading-4 text-neutral-white underline hover:text-neutral-200"
          >
            {t('linkText')}
          </Link>

          <Button variant="secondary" href={href} className="max-w-sm">
            {t('ctaButton')}
          </Button>
        </div>
      </div>
    </section>
  )
}

export { VetNutritionistCTA }
