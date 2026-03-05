'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/common/Button'
import Input from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveSuccess: () => void
  initialFirstName: string
  initialLastName: string
  initialBirthdate: string
  onUpdateName: (firstName: string, lastName: string) => Promise<void>
  onUpdateBirthdate: (birthdate: string) => Promise<void>
}

const EditProfileModal = ({
  isOpen,
  onClose,
  onSaveSuccess,
  initialFirstName,
  initialLastName,
  initialBirthdate,
  onUpdateName,
  onUpdateBirthdate,
}: EditProfileModalProps) => {
  const t = useTranslations('Profile.EditProfileModal')

  const validationSchema = z.object({
    firstName: z.string().min(1, { message: t('errors.firstNameRequired') }),
    lastName: z.string().min(1, { message: t('errors.lastNameRequired') }),
    birthdate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: t('errors.birthdateInvalid') }),
  })

  type FormData = z.infer<typeof validationSchema>

  const {
    control,
    formState: { errors },
    handleSubmit: rhfHandleSubmit,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      birthdate: initialBirthdate,
    },
    mode: 'all',
    resolver: zodResolver(validationSchema),
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        firstName: initialFirstName,
        lastName: initialLastName,
        birthdate: initialBirthdate,
      })
    }
  }, [isOpen, initialFirstName, initialLastName, initialBirthdate, reset])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [reset, onClose])

  const onSubmitForm: SubmitHandler<FormData> = async (data) => {
    try {
      await onUpdateName(data.firstName, data.lastName)
      await onUpdateBirthdate(data.birthdate)
      onSaveSuccess()
      handleClose()
    } catch (error) {
      console.error('Error updating profile', error)
    }
  }

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
            name="firstName"
            control={control}
            render={({
              field: { ref, name, value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <Input
                ref={ref}
                label={t('firstNameLabel')}
                type="text"
                value={value}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                error={error?.message}
                autoComplete="given-name"
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({
              field: { ref, name, value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <Input
                ref={ref}
                label={t('lastNameLabel')}
                type="text"
                value={value}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                error={error?.message}
                autoComplete="family-name"
              />
            )}
          />
          <Controller
            name="birthdate"
            control={control}
            render={({
              field: { ref, name, value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <Input
                ref={ref}
                label={t('birthdateLabel')}
                type="date"
                value={value}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                error={error?.message}
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
            className="w-full md:w-auto md:flex-1"
          >
            {t('saveButton')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export { EditProfileModal }
