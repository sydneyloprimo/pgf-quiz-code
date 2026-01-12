'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { Button } from '@/components/common/Button'
import { VisibilityIcon, VisibilityOffIcon } from '@/components/common/Icon'
import Input from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { InputIconPosition } from '@/types/enums/constants'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => void
}

const ChangePasswordModal = ({
  isOpen,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) => {
  const t = useTranslations('Profile.ChangePasswordModal')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  const handleReset = useCallback(() => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    setErrors({})
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const newErrors: typeof errors = {}

      if (!currentPassword) {
        newErrors.currentPassword = t('errors.currentPasswordRequired')
      }

      if (!newPassword) {
        newErrors.newPassword = t('errors.newPasswordRequired')
      } else if (newPassword.length < 8) {
        newErrors.newPassword = t('errors.newPasswordMinLength')
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = t('errors.confirmPasswordRequired')
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = t('errors.passwordsDoNotMatch')
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      onSubmit({
        currentPassword,
        newPassword,
        confirmPassword,
      })
      handleReset()
    },
    [currentPassword, newPassword, confirmPassword, onSubmit, t, handleReset]
  )

  const handleClose = useCallback(() => {
    handleReset()
    onClose()
  }, [handleReset, onClose])

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
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <h2 className="heading-h5 font-sans text-xl text-secondary-950">
          {t('heading')}
        </h2>
        <div className="flex flex-col gap-4">
          <Input
            label={t('currentPasswordLabel')}
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={errors.currentPassword}
            icon={
              <button
                type="button"
                onClick={toggleCurrentPassword}
                aria-label={
                  showCurrentPassword ? t('hidePassword') : t('showPassword')
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
          <Input
            label={t('newPasswordLabel')}
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
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
          <Input
            label={t('confirmPasswordLabel')}
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            icon={
              <button
                type="button"
                onClick={toggleConfirmPassword}
                aria-label={
                  showConfirmPassword ? t('hidePassword') : t('showPassword')
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
            {t('submitButton')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export { ChangePasswordModal }
