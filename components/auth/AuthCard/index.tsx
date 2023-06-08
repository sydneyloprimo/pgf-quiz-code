import Image from 'next/image'
import { ReactNode } from 'react'

import Card from '@/components/common/Card'
import blackLogo from 'public/icons/logo-black.svg'

interface AuthCardProps {
  children: ReactNode
  footer?: ReactNode
}

const AuthCard = ({ children, footer }: AuthCardProps) => {
  return (
    <Card
      className="mx-4 mt-9 md:mt-28 md:mx-32"
      header={
        <div className="flex justify-center mb-10">
          <Image src={blackLogo} alt="Logo black" width={173} height={30} />
        </div>
      }
      footer={footer}
    >
      {children}
    </Card>
  )
}

export default AuthCard
