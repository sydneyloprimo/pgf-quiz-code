'use client'

import { useTranslations } from 'next-intl'
import { useCookies } from 'react-cookie'

import { client } from '@/shopify/client'
import { useGetCustomerQuery } from '@/shopify/generated/graphql'
import { Cookies } from '@/types/enums/cookies'

const ProfileHeader = () => {
  const t = useTranslations('Profile')
  const [cookies] = useCookies([Cookies.customerAccessToken])

  const { data } = useGetCustomerQuery(client, {
    customerAccessToken: cookies[Cookies.customerAccessToken],
  })

  const customer = data?.customer
  const email = customer?.email || ''
  const createdAt = customer?.createdAt
    ? new Date(customer.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <div className="bg-quaternary-800 border border-secondary-200 p-5 md:p-10 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-4">
          <h1 className="heading-h5 md:heading-h2 text-secondary-100">
            {email}
          </h1>
          <p className="text-sm md:text-body-m text-quaternary-100 md:hidden">
            {t('accountCreated', { date: createdAt })}
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="hidden md:block text-sm md:text-body-m text-quaternary-100">
          {t('accountCreated', { date: createdAt })}
        </p>
      </div>
    </div>
  )
}

export { ProfileHeader }
