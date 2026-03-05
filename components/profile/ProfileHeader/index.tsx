'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

import { Button } from '@/components/common/Button'
import { ChangePasswordModal } from '@/components/profile/ChangePasswordModal'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { LogoutModal } from '@/components/profile/LogoutModal'
import { useModal } from '@/hooks/useModal'
import { client } from '@/shopify/client'
import {
  useCustomerUpdateMutation,
  useGetCustomerQuery,
} from '@/shopify/generated/graphql'
import { Cookies } from '@/types/enums/cookies'
import { Routes } from '@/types/enums/routes'

const ProfileHeader = () => {
  const t = useTranslations('Profile')
  const router = useRouter()
  const [cookies, , removeCookie] = useCookies([Cookies.customerAccessToken])

  const customerAccessToken = cookies[Cookies.customerAccessToken]

  const { data, refetch } = useGetCustomerQuery(client, {
    customerAccessToken: customerAccessToken ?? '',
  })

  const { mutateAsync: updateCustomer } = useCustomerUpdateMutation(client)

  const [birthdate, setBirthdate] = useState('')

  const customer = data?.customer

  const fetchBirthdate = useCallback(async () => {
    if (!customerAccessToken) return
    try {
      const res = await fetch('/api/profile/birthdate', {
        headers: {
          Authorization: `Bearer ${customerAccessToken}`,
        },
      })
      if (!res.ok) return
      const json = await res.json()
      setBirthdate(json.birthdate ?? '')
    } catch {
      /* silently ignore */
    }
  }, [customerAccessToken])

  useEffect(() => {
    fetchBirthdate()
  }, [fetchBirthdate])

  const firstName = customer?.firstName || ''
  const lastName = customer?.lastName || ''
  const createdAt = customer?.createdAt
    ? new Date(customer.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  const {
    isOpen: isChangePasswordModalOpen,
    openModal: openChangePasswordModal,
    closeModal: closeChangePasswordModal,
  } = useModal()

  const {
    isOpen: isLogoutModalOpen,
    openModal: openLogoutModal,
    closeModal: closeLogoutModal,
  } = useModal()

  const {
    isOpen: isEditProfileModalOpen,
    openModal: openEditProfileModal,
    closeModal: closeEditProfileModal,
  } = useModal()

  const handleUpdateName = useCallback(
    async (first: string, last: string) => {
      if (!customerAccessToken) return
      const result = await updateCustomer({
        customerAccessToken,
        customer: { firstName: first, lastName: last },
      })
      const errors = result.customerUpdate?.customerUserErrors ?? []
      if (errors.length > 0) {
        throw new Error(errors[0]?.message ?? 'Update failed')
      }
    },
    [customerAccessToken, updateCustomer]
  )

  const handleUpdateBirthdate = useCallback(
    async (birthdateValue: string) => {
      const res = await fetch('/api/profile/birthdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerAccessToken,
          birthdate: birthdateValue,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Birthdate update failed')
      }
    },
    [customerAccessToken]
  )

  const handleEditProfileSuccess = useCallback(() => {
    refetch()
    fetchBirthdate()
  }, [refetch, fetchBirthdate])

  const handleLogout = useCallback(() => {
    removeCookie(Cookies.customerAccessToken, { path: '/', secure: true })
    router.push(Routes.home)
  }, [removeCookie, router])

  const handleChangePassword = useCallback(
    (data: {
      currentPassword: string
      newPassword: string
      confirmPassword: string
    }) => {
      // TODO: Implement password change logic
      closeChangePasswordModal()
    },
    [closeChangePasswordModal]
  )
  return (
    <div className="bg-quaternary-800 border border-secondary-200 p-5 md:p-10 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-4">
          <h1 className="heading-h5 md:heading-h2 text-secondary-100">
            {firstName || lastName
              ? `${firstName} ${lastName}`.trim()
              : (customer?.email ?? '')}
          </h1>
          {birthdate && (
            <p className="text-body-m text-quaternary-100">
              {t('birthdate')}:{' '}
              {new Date(birthdate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
          <p className="text-sm md:text-body-m text-quaternary-100 md:hidden">
            {t('accountCreated', { date: createdAt })}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="tertiary"
            size="medium"
            className="w-full md:w-auto"
            onClick={openEditProfileModal}
          >
            {t('editProfile')}
          </Button>
          <Button
            variant="tertiary"
            size="medium"
            className="w-full md:w-auto"
            onClick={openChangePasswordModal}
          >
            {t('changePassword')}
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="hidden md:block text-sm md:text-body-m text-quaternary-100">
          {t('accountCreated', { date: createdAt })}
        </p>
        <button
          type="button"
          onClick={openLogoutModal}
          className="text-sm md:text-base font-bold text-primary-100 w-full md:w-auto text-center md:text-left cursor-pointer"
          aria-label={t('logOut')}
        >
          {t('logOut')}
        </button>
      </div>
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={closeChangePasswordModal}
        onSubmit={handleChangePassword}
      />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
      />
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={closeEditProfileModal}
        onSaveSuccess={handleEditProfileSuccess}
        initialFirstName={firstName}
        initialLastName={lastName}
        initialBirthdate={birthdate}
        onUpdateName={handleUpdateName}
        onUpdateBirthdate={handleUpdateBirthdate}
      />
    </div>
  )
}

export { ProfileHeader }
