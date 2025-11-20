'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import passwordVisibility from 'public/icons/visibility.svg'
import passwordVisibilityOff from 'public/icons/visibility_off.svg'
import { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { z } from 'zod'

import { ButtonPrimary } from '@/components/common/Button'
import Input from '@/components/common/Input'
import Spinner from '@/components/common/Spinner'
import { InputIconPosition } from '@/types/enums/constants'

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
}

const AuthForm = ({
  handleSubmit,
  isLoading,
  buttonText,
  apiError,
  validationSchema,
  clearApiError,
}: AuthFormProps) => {
  const t = useTranslations('Auth')
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

  return (
    <form onSubmit={rhfHandleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({
          field: { ref, name, value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <Input
            ref={ref}
            label={t('email')}
            value={value}
            className="mb-3"
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={t('emailPlaceholder')}
            autoComplete="on"
            id="email"
            error={error?.message}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({
          field: { ref, name, value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <Input
            ref={ref}
            label={t('password')}
            value={value}
            className="mb-3"
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
                  isPasswordVisible ? passwordVisibilityOff : passwordVisibility
                }
                alt=""
                width={20}
                height={19}
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              />
            }
            error={error?.message}
          />
        )}
      />

      {!isLoading && apiError && apiEmail === email && (
        <div className="text-red-500 text-md">{apiError}</div>
      )}

      <ButtonPrimary
        className="w-full mt-3 mb-5 h-[44px]"
        type="submit"
        disabled={
          !!errors.email?.message || !!errors.password?.message || isLoading
        }
      >
        {isLoading ? <Spinner /> : buttonText}
      </ButtonPrimary>
    </form>
  )
}

export default AuthForm
