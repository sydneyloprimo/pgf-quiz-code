'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { FormEvent, useCallback, useEffect, useState } from 'react'

import Input from '@/components/common/Input/Input'
import { client } from '@/shopify/client'
import { useCustomerCreateMutation } from '@/shopify/generated/graphql'
import { isEmailValid, isPasswordValid } from '@/utils/utils'

export default function SignUp() {
  const { push } = useRouter()
  const t = useTranslations('SignUp')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordVisibility, setPasswordVisibility] = useState(false)

  const {
    mutate: createCustomer,
    isLoading,
    data,
  } = useCustomerCreateMutation(client, {
    onSuccess: (data) => {
      if (!data.customerCreate?.customerUserErrors.length) {
        push('/auth/sign-in')
      }
    },
  })

  const getInputValidations = useCallback(() => {
    if (email) {
      setEmailError(!isEmailValid(email) ? 'Your email is invalid' : '')
    } else {
      setEmailError('')
    }

    if (password) {
      setPasswordError(
        !isPasswordValid(password) ? 'Your password is invalid.' : ''
      )
    } else {
      setPasswordError('')
    }
  }, [email, password])

  useEffect(() => {
    getInputValidations()
  }, [getInputValidations])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!!isEmailValid(email) && !!isPasswordValid(password)) {
      createCustomer({
        input: {
          email: email,
          password: password,
        },
      })
    }
  }

  return (
    <div className="w-[360px] h-[556px] bg-white text-black mx-4 mt-9 md:mt-28 md:mx-32 px-8 py-10 rounded-lg">
      <div className="flex justify-center mb-10">
        <Image
          src="/icons/logo-black.svg"
          alt="Logo black"
          width={173}
          height={30}
        />
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Input
          label={t('email')}
          error={emailError}
          type="text"
          placeholder={t('emailPlaceholder')}
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="on"
        />

        <Input
          label={t('password')}
          error={passwordError}
          type={passwordVisibility ? 'text' : 'password'}
          placeholder={t('passwordPlaceholder')}
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          icon={
            <Image
              src={
                passwordVisibility
                  ? '/icons/visibility_off.svg'
                  : '/icons/visibility.svg'
              }
              alt=""
              width={20}
              height={19}
              onClick={() => setPasswordVisibility(!passwordVisibility)}
            />
          }
          iconPosition="end"
          autoComplete="on"
        />

        {data?.customerCreate?.customerUserErrors.length ? (
          <div className="text-red-500 text-md">
            {data.customerCreate?.customerUserErrors[0].message}
          </div>
        ) : null}

        <button
          className="btn-primary w-full mt-3 mb-5 h-[44px]"
          type="submit"
          disabled={!email || !password || isLoading}
        >
          {t('buttonText')}
        </button>
      </form>

      <div className="flex justify-center gap-1">
        <span>{t('signinRedirectMessage')}</span>
        <Link className="text-links" href="/auth/sign-in">
          {t('signinRedirectLink')}
        </Link>
      </div>
    </div>
  )
}
