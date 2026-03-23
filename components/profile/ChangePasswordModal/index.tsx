'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/common/Button'
import { VisibilityIcon, VisibilityOffIcon } from '@/components/common/Icon'
import Input from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { InputIconPosition } from '@/types/enums/constants'
import { passwordRegExp } from '@/utils/utils'

interface ChangePasswordModalProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onSubmit: (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => void
}

const ChangePasswordModal = ({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) => {
  const t = useTranslations('Profile.ChangePasswordModal')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validationSchema = z
    .object({
      currentPassword: z
        .string()
        .min(1, { message: t('errors.currentPasswordRequired') }),
      newPassword: z.string().superRefine((val, ctx) => {
        if (!val || val.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.newPasswordRequired'),
          })
          return
        }
        if (val.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.newPasswordMinLength'),
          })
        }
        if (!passwordRegExp.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.newPasswordPattern'),
          })
        }
      }),
      confirmPassword: z
        .string()
        .min(1, { message: t('errors.confirmPasswordRequired') }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('errors.passwordsDoNotMatch'),
      path: ['confirmPassword'],
    })

  type FormData = z.infer<typeof validationSchema>

  const {
    control,
    formState: { errors },
    handleSubmit: rhfHandleSubmit,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'all',
    resolver: zodResolver(validationSchema),
  })

  const onSubmitForm: SubmitHandler<FormData> = (data) => {
    onSubmit({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    })
  }

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const toggleCurrentPassword = useCallback(() => {
    setShowCurrentPassword((prev) => !prev)
  }, [])

  const toggleNewPassword = useCallback(() => {
    setShowNewPassword((prev) => !prev)
  }, [])

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev)
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeButtonLabel={t('closeButtonLabel')}
      ariaLabel={t('ariaLabel')}
      className="max-w-lg p-8"
    >
      <form
        onSubmit={rhfHandleSubmit(onSubmitForm)}
        className="flex flex-col gap-6"
      >
        <h2 className="heading-h5 font-sans text-xl text-secondary-950">
          {t('heading')}
        </h2>
        <div className="flex flex-col gap-4">
          <Controller
            name="currentPassword"
            control={control}
            render={({
              field: { ref, name, value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <Input
                ref={ref}
                label={t('currentPasswordLabel')}
                labelClassName="text-body-m font-bold text-secondary-900"
                autoComplete="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={value}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                error={error?.message}
                icon={
                  <button
                    type="button"
                    onClick={toggleCurrentPassword}
                    aria-label={
                      showCurrentPassword
                        ? t('hidePassword')
                        : t('showPassword')
                    }
                    className="flex items-center justify-center"
                  >
                    {showCurrentPassword ? (
                      <VisibilityOffIcon className="size-6 text-secondary-950" />
                    ) : (
                      <VisibilityIcon className="size-6 text-secondary-950" />
                    )}
                  </button>
                }
                iconPosition={InputIconPosition.End}
              />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            render={({
              field: { ref, name, value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <Input
                ref={ref}
                label={t('newPasswordLabel')}
                labelClassName="text-body-m font-bold text-secondary-900"
                autoComplete="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={value}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                error={error?.message}
                icon={
                  <button
                    type="button"
                    onClick={toggleNewPassword}
                    aria-label={
                      showNewPassword ? t('hidePassword') : t('showPassword')
                    }
                    className="flex items-center justify-center"
                  >
                    {showNewPassword ? (
                      <VisibilityOffIcon className="size-6 text-secondary-950" />
                    ) : (
                      <VisibilityIcon className="size-6 text-secondary-950" />
                    )}
                  </button>
                }
                iconPosition={InputIconPosition.End}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({
              field: { ref, name, value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <Input
                ref={ref}
                label={t('confirmPasswordLabel')}
                labelClassName="text-body-m font-bold text-secondary-900"
                autoComplete="new-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={value}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                error={error?.message}
                icon={
                  <button
                    type="button"
                    onClick={toggleConfirmPassword}
                    aria-label={
                      showConfirmPassword
                        ? t('hidePassword')
                        : t('showPassword')
                    }
                    className="flex items-center justify-center"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon className="size-6 text-secondary-950" />
                    ) : (
                      <VisibilityIcon className="size-6 text-secondary-950" />
                    )}
                  </button>
                }
                iconPosition={InputIconPosition.End}
              />
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 pt-2">
          <Button
            type="button"
            variant="tertiary"
            onClick={handleClose}
            className="w-full md:w-auto md:flex-1"
          >
            {t('cancelButton')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full md:w-auto md:flex-1"
          >
            {t('submitButton')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export { ChangePasswordModal }
