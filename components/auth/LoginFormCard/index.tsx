import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'

import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

interface LoginFormCardProps extends PropsWithChildren {
  className?: string
}

const LoginFormCard = ({ children, className }: LoginFormCardProps) => {
  const t = useTranslations('SignIn')

  return (
    <div
      className={cn(
        'bg-tertiary-100',
        'flex flex-1 flex-col',
        'max-w-[600px] min-w-[335px]',
        'pb-12 pt-8 desktop:pt-[60px]',
        'px-5 desktop:px-8',
        'gap-12',
        'relative z-[2]',
        className
      )}
    >
      <div className="flex flex-col gap-8 items-center w-full">
        <div className="flex flex-col gap-5 items-center w-full">
          <div className="flex justify-center desktop:hidden">
            <Link href={Routes.home}>
              <Image
                src="/icons/logo-black.svg"
                alt={t('logoAlt')}
                width={115}
                height={100}
                priority
              />
            </Link>
          </div>
          <div className="flex flex-col gap-2 items-center text-center w-full">
            <h2
              className={cn(
                'font-display',
                'text-[32px] leading-[40px] tracking-[-0.32px]',
                'desktop:text-[40px] desktop:leading-[48px] desktop:tracking-[-0.4px]',
                'font-semibold',
                'text-neutral-950',
                'w-full'
              )}
            >
              {t('formHeading')}
            </h2>
            <p className={cn('text-body-m', 'text-secondary-900', 'w-full')}>
              {t('formSubHeading')}
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

export { LoginFormCard }
