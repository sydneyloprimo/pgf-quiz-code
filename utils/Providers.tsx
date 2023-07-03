'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PropsWithChildren, useState } from 'react'
import { CookiesProvider } from 'react-cookie'

import { Locale } from '@/i18n'

import ToastProvider from './ToasterProvider'

interface ProviderProps extends PropsWithChildren {
  params: { locale: Locale }
}

function Providers({ children, params }: ProviderProps) {
  const [client] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  )

  return (
    <QueryClientProvider client={client}>
      <CookiesProvider>
        <ToastProvider params={params}>{children}</ToastProvider>
      </CookiesProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default Providers
