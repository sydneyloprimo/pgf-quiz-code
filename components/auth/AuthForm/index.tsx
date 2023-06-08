'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FormEvent, useCallback, useEffect, useState } from 'react'

import { InputIconPosition } from '@/types/enums/constants'
import { isEmailValid, isPasswordValid } from '@/utils/utils'
import passwordVisibility from 'public/icons/visibility.svg'
import passwordVisibilityOff from 'public/icons/visibility_off.svg'

import Input from '../../common/Input'

interface AuthFormProps {
  handleSubmit: (email: string, password: string) => Promise<void>
  isLoading: boolean
  buttonText: string
  error?: string
}

const AuthForm = ({
  handleSubmit,
  isLoading,
  buttonText,
  error,
}: AuthFormProps) => {
  const t = useTranslations('Auth')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleSubmit(email, password)
  }

  return (
    <form onSubmit={onSubmit}>
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
            src={isPasswordVisible ? passwordVisibilityOff : passwordVisibility}
            alt=""
            width={20}
            height={19}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
          />
        }
        iconPosition={InputIconPosition.END}
        autoComplete="on"
      />

      <div className="text-red-500 text-md">{error}</div>

      <button
        className="btn-primary w-full mt-3 mb-5 h-[44px]"
        type="submit"
        disabled={!email || !password || isLoading}
      >
        {buttonText}
      </button>
    </form>
  )
}

export default AuthForm
