'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { useCookies } from 'react-cookie'

import { Button } from '@/components/common/Button'
import { ChangePasswordModal } from '@/components/profile/ChangePasswordModal'
import { LogoutModal } from '@/components/profile/LogoutModal'
import { useModal } from '@/hooks/useModal'
import { client } from '@/shopify/client'
import { useGetCustomerQuery } from '@/shopify/generated/graphql'
import { Cookies } from '@/types/enums/cookies'
import { Routes } from '@/types/enums/routes'

const ProfileHeader = () => {
  const t = useTranslations('Profile')
  const router = useRouter()
  const [cookies, , removeCookie] = useCookies([Cookies.customerAccessToken])

  const { data } = useGetCustomerQuery(client, {
    customerAccessToken: cookies[Cookies.customerAccessToken],
  })

  const customer = data?.customer
  const email = customer?.email || ''
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
            {email}
          </h1>
          <p className="text-sm md:text-body-m text-quaternary-100 md:hidden">
            {t('accountCreated', { date: createdAt })}
          </p>
        </div>
        <Button
          variant="tertiary"
          size="medium"
          className="w-full md:w-auto"
          onClick={openChangePasswordModal}
        >
          {t('changePassword')}
        </Button>
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
    </div>
  )
}

export { ProfileHeader }
