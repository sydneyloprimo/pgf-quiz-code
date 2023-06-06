'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { FormEvent, useCallback, useEffect, useState } from 'react'

import Input from '@/components/common/Input/Input'
import { client } from '@/shopify/client'
import { useCustomerCreateMutation } from '@/shopify/generated/graphql'
import { InputIconPosition } from '@/types/enums/constants'
import { Routes } from '@/types/enums/routes'
import { isEmailValid, isPasswordValid } from '@/utils/utils'
import blackLogo from 'public/icons/logo-black.svg'
import passwordVisibility from 'public/icons/visibility.svg'
import passwordVisibilityOff from 'public/icons/visibility_off.svg'

export default function SignUp() {
  const { push } = useRouter()
  const t = useTranslations('SignUp')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const {
    mutate: createCustomer,
    isLoading,
    data,
  } = useCustomerCreateMutation(client, {
    onSuccess: (data) => {
      if (!data.customerCreate?.customerUserErrors.length) {
        push(Routes.signin)
      }
    },
  })

  const getInputValidations = useCallback(() => {
    if (email) {
      setEmailError(!isEmailValid(email) ? t('emailValidation') : '')
    } else {
      setEmailError('')
    }

    if (password) {
      setPasswordError(
        !isPasswordValid(password) ? t('passwordValidation') : ''
      )
    } else {
      setPasswordError('')
    }
  }, [email, password, t])

  useEffect(() => {
    getInputValidations()
  }, [getInputValidations])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
        <Image src={blackLogo} alt="Logo black" width={173} height={30} />
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          label={t('email')}
          error={emailError}
          type="text"
          placeholder={t('emailPlaceholder')}
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="on"
        />

        <Input
          label={t('password')}
          error={passwordError}
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder={t('passwordPlaceholder')}
          id="password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          icon={
            <Image
              src={
                isPasswordVisible ? passwordVisibilityOff : passwordVisibility
              }
              alt=""
              width={20}
              height={19}
              onClick={() => setIsPasswordVisible((prev) => !prev)}
            />
          }
          iconPosition={InputIconPosition.END}
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
