'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

interface OptionSelectProductHeaderProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  isMostPopular?: boolean
}

const OptionSelectProductHeader = ({
  title,
  description,
  imageSrc,
  imageAlt,
  isMostPopular = false,
}: OptionSelectProductHeaderProps) => {
  const t = useTranslations('Common.OptionSelectProduct')

  return (
    <>
      {isMostPopular && (
        <div
          className={cn(
            'absolute top-0 left-4 -translate-y-1/2',
            'bg-secondary-600 text-neutral-white',
            'px-3 py-1 rounded-full',
            'text-sm font-semibold'
          )}
        >
          {t('mostPopular')}
        </div>
      )}

      <div className="flex flex-row items-stretch gap-4 mb-6">
        <div className="relative size-32 shrink-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain rounded-full"
            sizes="128px"
          />
          <div className="absolute bottom-0 right-0">
            <Image
              src="/images/animal-welfare-certified.png"
              alt={t('animalWelfareCertified')}
              width={60}
              height={70}
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 justify-center px-4">
          <h3 className="text-2xl mb-2 font-display">{title}</h3>
          <p className="text-base text-secondary-950 font-sans">
            {description}
          </p>
        </div>
      </div>
    </>
  )
}

export { OptionSelectProductHeader }
export type { OptionSelectProductHeaderProps }
