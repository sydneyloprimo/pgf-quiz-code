'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import Card from '@/components/common/Card'
import Input from '@/components/common/Input'
import { client } from '@/shopify/client'
import { useGetCustomerQuery } from '@/shopify/generated/graphql'
import { Cookies } from '@/types/enums/cookies'

export default function ProfilePage() {
  const [cookies] = useCookies([Cookies.customerAccessToken])
  const t = useTranslations('Profile')
  const [isReadOnly, setIsReadOnly] = useState(true)

  const validationSchema = z.object({
    address: z.string(),
    city: z.string(),
    country: z.string(),
    email: z.string(),
    name: z.string(),
    phone: z.string(),
    zip: z.string(),
  })
  type ValidationSchema = z.infer<typeof validationSchema>

  const { data } = useGetCustomerQuery(client, {
    customerAccessToken: cookies.token,
  })

  const { control, handleSubmit: rhfHandleSubmit } = useForm({
    defaultValues: {
      address: '',
      city: '',
      country: '',
      email: '',
      name: '',
      phone: '',
      zip: '',
    },
    resolver: zodResolver(validationSchema),
    values: {
      address: data?.customer?.defaultAddress?.address1 || '',
      city: data?.customer?.defaultAddress?.city || '',
      country: data?.customer?.defaultAddress?.country || '',
      email: data?.customer?.email || '',
      name: data?.customer?.firstName || '',
      phone: data?.customer?.phone || '',
      zip: data?.customer?.defaultAddress?.zip || '',
    },
  })

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    console.log('form submit', data)
  }

  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <Card className="w-full !rounded-none md:!rounded-lg">
        <div className="flex flex-col justify-between md:items-center mb-6 md:flex-row">
          <h2 className="h2">{t('title')}</h2>
          {isReadOnly && (
            <button
              className="link-primary flex"
              onClick={() => setIsReadOnly(!isReadOnly)}
              data-qa="edit-settings"
            >
              {t('editSettings')}
            </button>
          )}
        </div>
        <div className="h-px w-full bg-light-grey mb-6 md:hidden"></div>
        <h3 className="h3 mb-6">{t('subtitle')}</h3>
        <form
          className="flex flex-col gap-4"
          onSubmit={rhfHandleSubmit(onSubmit)}
        >
          <div className="flex gap-4 flex-col md:flex-row">
            <Controller
              name="name"
              control={control}
              render={({
                field: { ref, name, value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <Input
                  readOnly={isReadOnly}
                  ref={ref}
                  label={t('name')}
                  placeholder={t('namePlaceholder')}
                  value={value}
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="on"
                  data-qa="name-input"
                  id="name"
                  error={error?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({
                field: { ref, name, value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <Input
                  readOnly={isReadOnly}
                  ref={ref}
                  label={t('email')}
                  placeholder={t('emailPlaceholder')}
                  value={value}
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="on"
                  id="email"
                  error={error?.message}
                  data-qa="email-input"
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({
                field: { ref, name, value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <Input
                  readOnly={isReadOnly}
                  ref={ref}
                  label={t('phone')}
                  placeholder={t('phonePlaceholder')}
                  value={value}
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="on"
                  id="phone"
                  error={error?.message}
                  data-qa="phone-input"
                />
              )}
            />
          </div>
          <div className="flex gap-4 flex-col md:flex-row">
            <Controller
              name="address"
              control={control}
              render={({
                field: { ref, name, value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <Input
                  readOnly={isReadOnly}
                  ref={ref}
                  label={t('address')}
                  placeholder={t('addressPlaceholder')}
                  value={value}
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="on"
                  id="address"
                  error={error?.message}
                  data-qa="address-input"
                />
              )}
            />
            <Controller
              name="city"
              control={control}
              render={({
                field: { ref, name, value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <Input
                  readOnly={isReadOnly}
                  ref={ref}
                  label={t('city')}
                  placeholder={t('cityPlaceholder')}
                  value={value}
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="on"
                  id="city"
                  error={error?.message}
                  data-qa="city-input"
                />
              )}
            />
            <Controller
              name="country"
              control={control}
              render={({
                field: { ref, name, value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <Input
                  readOnly={isReadOnly}
                  ref={ref}
                  label={t('country')}
                  placeholder={t('countryPlaceholder')}
                  value={value}
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="on"
                  id="country"
                  error={error?.message}
                  data-qa="country-input"
                />
              )}
            />
            <Controller
              name="zip"
              control={control}
              render={({
                field: { ref, name, value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <Input
                  readOnly={isReadOnly}
                  ref={ref}
                  label={t('zip')}
                  placeholder={t('zipPlaceholder')}
                  value={value}
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="on"
                  id="zip"
                  error={error?.message}
                  data-qa="zip-input"
                />
              )}
            />
          </div>
          {!isReadOnly && (
            <>
              <div className="h-px w-full bg-light-grey"></div>
              <div className="w-full flex justify-end gap-5">
                <button
                  onClick={() => setIsReadOnly(!isReadOnly)}
                  className="btn-secondary h-[44px]"
                  data-qa="cancel-button"
                >
                  {t('cancelButtonText')}
                </button>
                <button
                  type="submit"
                  className="btn-primary h-[44px]"
                  data-qa="submit-button"
                >
                  {t('submitButtonText')}
                </button>
              </div>
            </>
          )}
        </form>
      </Card>
    </div>
  )
}
