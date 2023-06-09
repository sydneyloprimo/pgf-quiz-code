import React, { PropsWithChildren } from 'react'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

type DetailLayoutProps = PropsWithChildren<{ params: { locale: Locale } }>

const DetailLayout = ({ children, params }: DetailLayoutProps) => (
  <LocaleWrapper localeGroup="Detail" params={params}>
    <div className="min-h-screen min-w-full text-black extended-header flex justify-center">
      {children}
    </div>
  </LocaleWrapper>
)

export default DetailLayout
