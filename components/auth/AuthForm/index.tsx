'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { z } from 'zod'

import Input from '@/components/common/Input'
import { InputIconPosition } from '@/types/enums/constants'
import passwordVisibility from 'public/icons/visibility.svg'
import passwordVisibilityOff from 'public/icons/visibility_off.svg'

interface AuthFormProps {
  handleSubmit: (email: string, password: string) => Promise<void>
  isLoading: boolean
  buttonText: string
  apiError?: string
  validationSchema: z.ZodObject<{
    email: z.ZodString
    password: z.ZodString
  }>
}

const AuthForm = ({
  handleSubmit,
  isLoading,
  buttonText,
  apiError,
  validationSchema,
}: AuthFormProps) => {
  const t = useTranslations('Auth')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  type ValidationSchema = z.infer<typeof validationSchema>

  const {
    control,
    formState: { errors },
    handleSubmit: rhfHandleSubmit,
  } = useForm<ValidationSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
    resolver: zodResolver(validationSchema),
  })

  const onSubmit: SubmitHandler<ValidationSchema> = ({ email, password }) => {
    handleSubmit(email, password)
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
            iconPosition={InputIconPosition.END}
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

      <div className="text-red-500 text-md">{apiError}</div>

      <button
        className="btn-primary w-full mt-3 mb-5 h-[44px]"
        type="submit"
        disabled={
          !!errors.email?.message || !!errors.password?.message || isLoading
        }
      >
        {buttonText}
      </button>
    </form>
  )
}

export default AuthForm
