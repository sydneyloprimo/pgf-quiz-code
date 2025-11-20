import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React, { Dispatch, SetStateAction } from 'react'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'
import { useMediaQuery } from 'usehooks-ts'

import {
  DropdownItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/DropdownMenu'
import Toast, { ToastTypes } from '@/components/common/Toast'
import { MediaQuery } from '@/constants'
import { Cookies } from '@/types/enums/cookies'
import { Routes } from '@/types/enums/routes'

interface HeaderDropdownMenuProps {
  isOpen: boolean
  onMenuChange: Dispatch<SetStateAction<boolean>>
}

const HeaderDropdownMenu = ({
  isOpen,
  onMenuChange,
}: HeaderDropdownMenuProps) => {
  const router = useRouter()
  const t = useTranslations('Header')
  const [cookies, , removeCookie] = useCookies([Cookies.customerAccessToken])
  const isLoggedIn = !!cookies[Cookies.customerAccessToken]
  const isMobile = useMediaQuery(MediaQuery.mobile)

  const createLogoutToast = (success: boolean) =>
    toast(
      <Toast
        type={success ? ToastTypes.success : ToastTypes.error}
        description={success ? t('successfulLogout') : t('failedLogout')}
        iconAlt={success ? t('successIconAlt') : t('errorIconAlt')}
        title={success ? t('successTitle') : t('errorTitle')}
      />,
      {
        className: 'md:max-w-lg border-restored border rounded-lg',
        position: isMobile ? 'top-center' : 'bottom-center',
      }
    )

  const handleLogout = () => {
    try {
      removeCookie(Cookies.customerAccessToken, { path: '/' })
      createLogoutToast(true)
    } catch (error) {
      createLogoutToast(false)
    }
  }

  const handleProfileClick = () => {
    if (isLoggedIn) {
      router.push(Routes.profile)
    } else {
      router.push(Routes.signin)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={onMenuChange}>
      <DropdownMenuTrigger
        data-qa="header-dropdown-menu"
        className={cn(
          'text-white outline-white bg-neutral-950 px-4 flex items-center justify-between outline outline-1 focus:outline-dashed focus:outline-2 focus:outline-primary-600 hover:bg-primary-700 hover:outline-none disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-700 disabled:outline-none active:bg-primary-600 active:outline-primary-400 active:outline md:w-[168px] text-sm h-8 md:h-10',
          isOpen
            ? '!rounded-t-sm md:!rounded-t-md'
            : '!rounded-sm md:!rounded-md'
        )}
      >
        <span className="hidden md:inline">{t('myAccount')}</span>
        <div className="hidden md:block">
          {isOpen ? (
            <Image src="/icons/chevron-up.svg" alt="" width={14} height={8} />
          ) : (
            <Image src="/icons/chevron-down.svg" alt="" width={14} height={8} />
          )}
        </div>
        <Image
          className="md:hidden"
          alt={t('hamburgerIcon')}
          src="/icons/hamburger.svg"
          width={24}
          height={24}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-1}
        sideOffset={5}
        className="p-px bg-white rounded-b-sm md:rounded-b-md w-[calc(var(--radix-dropdown-menu-trigger-width)*2)] md:w-[calc(var(--radix-dropdown-menu-trigger-width)+2px)] max-g-[var(--radix-dropdown-menu-content-available-height)]"
      >
        <DropdownItem
          asChild
          className="text-sm last-of-type:rounded-b-sm md:last-of-type:rounded-b-md"
        >
          <button onClick={handleProfileClick} data-qa="dropdown-option">
            {t('myProfile')}
          </button>
        </DropdownItem>
        <DropdownItem
          asChild
          className="text-sm last-of-type:rounded-b-sm md:last-of-type:rounded-b-md"
        >
          <Link href={Routes.orders}>{t('myOrders')}</Link>
        </DropdownItem>
        {isLoggedIn && (
          <>
            <DropdownMenuSeparator className="h-[1px] bg-white" />
            <DropdownItem
              asChild
              className="text-sm last-of-type:rounded-b-sm md:last-of-type:rounded-b-md"
            >
              <button data-qa="dropdown-option" onClick={handleLogout}>
                {t('logout')}
              </button>
            </DropdownItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default HeaderDropdownMenu
