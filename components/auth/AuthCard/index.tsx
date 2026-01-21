import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import blackLogo from 'public/icons/logo-black.svg'
import { PropsWithChildren, ReactNode } from 'react'

import Card from '@/components/common/Card'
import { Routes } from '@/types/enums/routes'

interface AuthCardProps extends PropsWithChildren {
  footer?: ReactNode
}

const AuthCard = ({ children, footer }: AuthCardProps) => {
  const t = useTranslations('Auth')

  return (
    <Card className="mx-4 mt-9 md:mt-28 md:mx-32 h-fit">
      <div className="flex justify-center mb-10">
        <Link href={Routes.home}>
          <Image src={blackLogo} alt={t('logoAlt')} width={173} height={30} />
        </Link>
      </div>
      {children}
      {footer}
    </Card>
  )
}

export { AuthCard }
