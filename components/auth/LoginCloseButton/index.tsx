import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Routes } from '@/types/enums/routes'

const LoginCloseButton = () => {
  const t = useTranslations('SignIn')

  return (
    <Link
      href={Routes.home}
      className="absolute right-5 top-3 z-4 p-3 flex items-center justify-center"
      aria-label={t('closeButtonAriaLabel')}
    >
      <div className="relative size-6">
        <Image
          src="/icons/cross.svg"
          alt=""
          width={24}
          height={24}
          className="brightness-0 invert w-6 h-6"
        />
      </div>
    </Link>
  )
}

export { LoginCloseButton }
