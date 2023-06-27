import cn from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React, { Dispatch, SetStateAction } from 'react'
import { useCookies } from 'react-cookie'

import {
  DropdownItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/DropdownMenu'
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

  const handleProfileClick = () => {
    if (isLoggedIn) {
      router.push(Routes.profile)
    } else {
      router.push(Routes.signin)
    }
  }

  const handleLogout = () => {
    removeCookie(Cookies.customerAccessToken, { path: '/' })
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={onMenuChange}>
      <DropdownMenuTrigger
        className={cn(
          'dropdown-menu md:w-[168px] text-sm h-8 md:h-10',
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
          className="dropdown-menu-item text-sm last-of-type:rounded-b-sm md:last-of-type:rounded-b-md"
        >
          <button onClick={handleProfileClick}>{t('myProfile')}</button>
        </DropdownItem>
        {isLoggedIn && (
          <>
            <DropdownMenuSeparator className="h-[1px] bg-white" />
            <DropdownItem
              asChild
              className="dropdown-menu-item text-sm last-of-type:rounded-b-sm md:last-of-type:rounded-b-md"
            >
              <button onClick={handleLogout}>{t('logout')}</button>
            </DropdownItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default HeaderDropdownMenu
