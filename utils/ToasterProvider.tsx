'use client'

import { PropsWithChildren } from 'react'
import { Slide, ToastContainer } from 'react-toastify'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

import 'react-toastify/dist/ReactToastify.css'

interface ToastProviderProps extends PropsWithChildren {
  params: { locale: Locale }
}

export default function ToastProvider({
  children,
  params,
}: ToastProviderProps) {
  return (
    <>
      {children}
      <LocaleWrapper localeGroup="Common" params={params}>
        <ToastContainer
          transition={Slide}
          hideProgressBar
          limit={1}
          autoClose={5000}
        />
      </LocaleWrapper>
    </>
  )
}
