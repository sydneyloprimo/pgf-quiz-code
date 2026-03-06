'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import passwordVisibility from 'public/icons/visibility.svg'
import passwordVisibilityOff from 'public/icons/visibility_off.svg'
import { useState, useCallback } from 'react'
import { Controller, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormFieldLabel } from './FormFieldLabel'
import { PasswordLabel } from './PasswordLabel'

import { Button } from '@/components/common/Button'
import Input from '@/components/common/Input'
import Spinner from '@/components/common/Spinner'
import { InputIconPosition } from '@/types/enums/constants'
import { Routes } from '@/types/enums/routes'

interface AuthFormProps {
  handleSubmit: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<void>
  isLoading: boolean
  buttonText: string
  apiError?: string
  validationSchema: z.ZodObject<{
    email: z.ZodString
    password: z.ZodString
    firstName?: z.ZodString
    lastName?: z.ZodString
  }>
  clearApiError: () => void
  showRedirectLink?: boolean
  redirectLinkHref?: string
  redirectLinkText?: string
  redirectMessage?: string
  showNameFields?: boolean
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
  showNameFields = false,
}: AuthFormProps) => {
  const t = useTranslations('Auth')
  const tSignIn = useTranslations('SignIn')
  const tSignUp = useTranslations('SignUp')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [apiEmail, setApiEmail] = useState<string>('')

  type AuthFormValues = {
    email: string
    password: string
    firstName?: string
    lastName?: string
  }

  const {
    control,
    formState: { errors },
    handleSubmit: rhfHandleSubmit,
    watch,
  } = useForm<AuthFormValues>({
    defaultValues: {
      email: '',
      password: '',
      ...(showNameFields && { firstName: '', lastName: '' }),
    },
    mode: 'all',
    resolver: zodResolver(
      validationSchema
    ) as unknown as Resolver<AuthFormValues>,
  })

  const email = watch('email')

  const onSubmit: SubmitHandler<AuthFormValues> = (values) => {
    const { email, password, firstName, lastName } = values
    handleSubmit(email, password, firstName, lastName)
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
          {showNameFields && (
            <>
              <Controller
                name="firstName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div className="flex flex-col gap-1 items-start w-full">
                    <FormFieldLabel
                      label={tSignUp('firstNamePlaceholder')}
                      htmlFor="firstName"
                    />
                    <Input
                      {...field}
                      className="w-full"
                      placeholder={tSignUp('firstNamePlaceholder')}
                      autoComplete="given-name"
                      id="firstName"
                      error={error?.message}
                    />
                  </div>
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div className="flex flex-col gap-1 items-start w-full">
                    <FormFieldLabel
                      label={tSignUp('lastNamePlaceholder')}
                      htmlFor="lastName"
                    />
                    <Input
                      {...field}
                      className="w-full"
                      placeholder={tSignUp('lastNamePlaceholder')}
                      autoComplete="family-name"
                      id="lastName"
                      error={error?.message}
                    />
                  </div>
                )}
              />
            </>
          )}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col gap-1 items-start w-full">
                <FormFieldLabel label={t('email')} htmlFor="email" />
                <Input
                  {...field}
                  className="w-full"
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
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col gap-1 items-start w-full">
                <PasswordLabel />
                <Input
                  {...field}
                  className="w-full"
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
            !!errors.email?.message ||
            !!errors.password?.message ||
            (showNameFields &&
              (!!errors.firstName?.message || !!errors.lastName?.message)) ||
            isLoading
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

export { AuthForm }
