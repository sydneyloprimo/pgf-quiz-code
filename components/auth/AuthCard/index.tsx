import Image from 'next/image'
import { PropsWithChildren, ReactNode } from 'react'

import Card from '@/components/common/Card'
import blackLogo from 'public/icons/logo-black.svg'

interface AuthCardProps extends PropsWithChildren {
  footer?: ReactNode
}

const AuthCard = ({ children, footer }: AuthCardProps) => (
  <Card className="mx-4 mt-9 md:mt-28 md:mx-32">
    <div className="flex justify-center mb-10">
      <Image src={blackLogo} alt="Logo black" width={173} height={30} />
    </div>
    {children}
    {footer}
  </Card>
)

export default AuthCard
