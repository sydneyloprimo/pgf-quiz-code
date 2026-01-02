'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import passwordVisibility from 'public/icons/visibility.svg'
import passwordVisibilityOff from 'public/icons/visibility_off.svg'
import { useState, useCallback } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { z } from 'zod'

import { EmailLabel } from './EmailLabel'
import { PasswordLabel } from './PasswordLabel'

import { Button } from '@/components/common/Button'
import Input from '@/components/common/Input'
import Spinner from '@/components/common/Spinner'
import { InputIconPosition } from '@/types/enums/constants'
import { Routes } from '@/types/enums/routes'

interface AuthFormProps {
  handleSubmit: (email: string, password: string) => Promise<void>
  isLoading: boolean
  buttonText: string
  apiError?: string
  validationSchema: z.ZodObject<{
    email: z.ZodString
    password: z.ZodString
  }>
  clearApiError: () => void
  showRedirectLink?: boolean
  redirectLinkHref?: string
  redirectLinkText?: string
  redirectMessage?: string
}

const AuthForm = ({
  handleSubmit,
  isLoading,
  buttonText,
  apiError,
  validationSchema,
  clearApiError,
  showRedirectLink = true,
  redirectLinkHref = Routes.signup,
  redirectLinkText,
  redirectMessage,
}: AuthFormProps) => {
  const t = useTranslations('Auth')
  const tSignIn = useTranslations('SignIn')
  const tSignUp = useTranslations('SignUp')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [apiEmail, setApiEmail] = useState<string>('')

  type ValidationSchema = z.infer<typeof validationSchema>

  const {
    control,
    formState: { errors },
    handleSubmit: rhfHandleSubmit,
    watch,
  } = useForm<ValidationSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
    resolver: zodResolver(validationSchema),
  })

  const email = watch('email')

  const onSubmit: SubmitHandler<ValidationSchema> = ({ email, password }) => {
    handleSubmit(email, password)
    setApiEmail(email)
    clearApiError()
  }

  const handleTogglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev)
  }, [])

  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <form onSubmit={rhfHandleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col gap-4 items-start w-full">
          <Controller
            name="email"
            control={control}
            render={({
              field: { ref, name, value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <div className="flex flex-col gap-1 items-start w-full">
                <EmailLabel />
                <Input
                  ref={ref}
                  label=""
                  value={value}
                  className="w-full"
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={t('emailPlaceholder')}
                  autoComplete="on"
                  id="email"
                  error={error?.message}
                />
              </div>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({
              field: { ref, name, value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <div className="flex flex-col gap-1 items-start w-full">
                <PasswordLabel />
                <Input
                  ref={ref}
                  label=""
                  value={value}
                  className="w-full"
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={t('passwordPlaceholder')}
                  autoComplete="on"
                  id="password"
                  iconPosition={InputIconPosition.End}
                  type={isPasswordVisible ? 'text' : 'password'}
                  icon={
                    <Image
                      src={
                        isPasswordVisible
                          ? passwordVisibilityOff
                          : passwordVisibility
                      }
                      alt=""
                      width={24}
                      height={24}
                      onClick={handleTogglePasswordVisibility}
                      className="cursor-pointer"
                    />
                  }
                  error={error?.message}
                />
              </div>
            )}
          />
        </div>

        {!isLoading && apiError && apiEmail === email && (
          <div className="text-feedback-error-500 text-body-m mt-2">
            {apiError}
          </div>
        )}

        <Button
          variant="primary"
          className="w-full mt-4 tracking-normal h-11"
          type="submit"
          disabled={
            !!errors.email?.message || !!errors.password?.message || isLoading
          }
        >
          {isLoading ? <Spinner /> : buttonText}
        </Button>
      </form>
      {showRedirectLink && (
        <div className="flex flex-col lg:flex-row gap-1 items-center justify-center w-full mt-3">
          <p className="text-body-l text-tertiary-900">
            {redirectMessage ||
              (redirectLinkHref === Routes.signin
                ? tSignUp('signinRedirectMessage')
                : tSignIn('accountQuestion'))}
          </p>
          <Link
            href={redirectLinkHref}
            className="text-body-m font-bold text-secondary-900 underline"
          >
            {redirectLinkText ||
              (redirectLinkHref === Routes.signin
                ? tSignUp('signinRedirectLink')
                : tSignIn('createAccountLink'))}
          </Link>
        </div>
      )}
    </div>
  )
}

export default AuthForm
