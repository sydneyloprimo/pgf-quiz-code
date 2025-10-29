'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PropsWithChildren, useState } from 'react'
import { CookiesProvider } from 'react-cookie'

import ToastProvider from './ToasterProvider'

import { Locale } from '@/i18n'


interface ProviderProps extends PropsWithChildren {
  params: Promise<{ locale: Locale }>
}

function Providers({ children }: ProviderProps) {
  const [client] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  )

  return (
    <QueryClientProvider client={client}>
      <CookiesProvider>
        <ToastProvider>{children}</ToastProvider>
      </CookiesProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default Providers
