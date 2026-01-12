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
        'max-w-xl min-w-[335px]',
        'pb-6 pt-6 lg:pt-15 lg:pb-12',
        'px-5 lg:px-8',
        'gap-12',
        'relative z-2',
        className
      )}
    >
      <div className="flex flex-col gap-8 items-center w-full">
        <div className="flex flex-col gap-5 items-center w-full">
          <div className="flex justify-center lg:hidden">
            <Link href={Routes.home}>
              <Image
                src="/images/login-logo-full.svg"
                alt={t('logoAlt')}
                width={156}
                height={136}
                priority
              />
            </Link>
          </div>
          <div className="flex flex-col gap-2 items-center text-center w-full">
            <h2 className="heading-h4 lg:heading-h2 tracking-tight text-neutral-950 w-full">
              {t('formHeading')}
            </h2>
            <p className="text-body-m text-secondary-900 w-full">
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
