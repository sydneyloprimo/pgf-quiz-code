import Image from 'next/image'
import { useTranslations } from 'next-intl'

const LeadershipSection = () => {
  const t = useTranslations('About.Leadership')

  return (
    <section className="w-full pt-14 px-5 lg:px-24 flex flex-col lg:flex-row gap-0 items-stretch justify-start">
      <div className="w-full lg:w-2/5 shrink-0 relative overflow-hidden aspect-square lg:aspect-auto lg:h-[765px]">
        <Image
          src="/images/about/leadership.jpg"
          alt={t('imageAlt')}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
        <div
          className="absolute inset-0 bg-secondary-950 opacity-41 mix-blend-color"
          aria-hidden="true"
        />
      </div>
      <div className="w-full lg:w-3/5 lg:h-[765px] bg-neutral-400 px-10 lg:px-24 flex flex-col justify-center gap-4 lg:gap-8 relative py-10 lg:py-0">
        <div className="flex flex-col gap-4">
          <p className="font-display text-base leading-6 text-secondary-950 mb-2.5 wrap-break-word first-letter:text-3xl first-letter:font-normal">
            {t('paragraph1')}
          </p>
          <p className="font-display text-base leading-6 text-secondary-950 wrap-break-word">
            {t('paragraph2')}
          </p>
        </div>
        <div className="flex items-center justify-end mt-8">
          <p className="font-sans font-bold text-base leading-6 text-secondary-950 text-right wrap-break-word">
            {t('signature')}
          </p>
        </div>
        <div
          className="absolute right-0 bottom-0 w-40 h-28 rotate-[110deg]"
          aria-hidden="true"
        >
          <Image
            src="/icons/leadership-signature.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  )
}

export { LeadershipSection }
