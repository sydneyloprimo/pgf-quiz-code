'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { client } from 'shopify/client'
import { useGetCartQuery } from 'shopify/generated/graphql'

import {
  CloseIcon,
  HamburgerIcon,
  PGFTextLogo,
  ShoppingCartIcon,
  UserIcon,
} from '@/components/common/Icon'
import useCartCookie from '@/hooks/useCartCookie'
import { QuizStep } from '@/types/enums/constants'
import { Cookies } from '@/types/enums/cookies'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'
import { getQuizStepPath } from '@/utils/quizRoutes'

interface NavLinkProps {
  href: string
  label: string
  isActive: boolean
}

const NavLink = ({ href, label, isActive }: NavLinkProps) => (
  <Link
    href={href}
    className={cn(
      'font-display text-xl leading-8 tracking-wide',
      isActive
        ? 'text-secondary-400'
        : 'text-neutral-white hover:text-secondary-400'
    )}
  >
    {label}
  </Link>
)

const MainNav = () => {
  const t = useTranslations('MainNav')
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cookies] = useCookies([Cookies.customerAccessToken])
  const isLoggedIn = !!cookies[Cookies.customerAccessToken]
  const profileHref = isLoggedIn ? Routes.profile : Routes.signin
  const { cartId } = useCartCookie()

  const { data } = useGetCartQuery(
    client,
    { id: cartId },
    {
      enabled: !!cartId,
      refetchOnWindowFocus: false,
    }
  )

  const totalQuantity = data?.cart?.totalQuantity ?? 0
  const hasItems = totalQuantity > 0
  const quizResultsPath = getQuizStepPath(QuizStep.Results)
  const isHome = pathname === '/'

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: Routes.home, label: t('home') },
    { href: Routes.formulation, label: t('ourFormulation') },
    { href: Routes.about, label: t('aboutUs') },
    { href: Routes.recipes, label: t('ourRecipes') },
  ]

  const isActiveLink = (href: string) => {
    if (href === Routes.home) {
      return pathname === '/'
    }
    return pathname.includes(href)
  }

  return (
    <nav
      className={cn(
        'w-full group',
        'lg:overflow-hidden',
        isHome && !isScrolled
          ? 'fixed top-0 left-0 right-0 z-50 bg-secondary-950 lg:bg-transparent'
          : isHome && isScrolled
            ? 'fixed top-0 left-0 right-0 z-50 bg-secondary-950'
            : 'relative bg-secondary-950',
        'px-5 md:px-24 py-3',
        'flex items-center justify-between',
        isHome && !isScrolled ? 'shadow-none' : 'shadow-sm'
      )}
      aria-label={t('ariaLabel')}
    >
      {isHome && !isScrolled && (
        <div
          className={cn(
            'absolute inset-0 -z-10',
            'hidden lg:block',
            'bg-secondary-950',
            'transform -translate-y-full',
            'group-hover:translate-y-0',
            'transition-transform duration-300'
          )}
          aria-hidden="true"
        />
      )}
      {/* Logo */}
      <Link
        href={Routes.home}
        className="shrink-0 flex items-center"
        aria-label={t('logoAria')}
      >
        <PGFTextLogo className="h-11 w-auto text-neutral-white" />
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center justify-center flex-1 gap-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            isActive={isActiveLink(link.href)}
          />
        ))}
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-1">
        <Link
          href={profileHref}
          className="p-3 text-neutral-white hover:text-secondary-400"
          aria-label={t('profileAria')}
        >
          <UserIcon className="size-5" />
        </Link>
        <Link
          href={quizResultsPath}
          className="p-3 text-neutral-white hover:text-secondary-400 relative"
          aria-label={t('cartAria')}
        >
          <ShoppingCartIcon className="size-5" />
          {hasItems && (
            <span
              className={cn(
                'absolute top-0 left-0',
                'bg-feedback-error-500',
                'text-neutral-white',
                'text-[10px] font-bold',
                'rounded-full',
                'min-w-[16px] h-4',
                'flex items-center justify-center',
                'px-1'
              )}
              aria-label={t('itemCountAriaLabel', { count: totalQuantity })}
            >
              {totalQuantity > 99 ? '99+' : totalQuantity}
            </span>
          )}
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="lg:hidden p-3 text-neutral-white hover:text-secondary-400"
          onClick={handleToggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? t('closeMenuAria') : t('openMenuAria')}
        >
          {isMobileMenuOpen ? (
            <CloseIcon className="size-5" />
          ) : (
            <HamburgerIcon className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className={cn(
            'lg:hidden absolute top-full left-0 right-0',
            'bg-secondary-950 px-5 py-6',
            'flex flex-col gap-4',
            'shadow-md z-50'
          )}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleCloseMobileMenu}
              className={cn(
                'font-display text-xl leading-8 tracking-wide py-2',
                isActiveLink(link.href)
                  ? 'text-secondary-400'
                  : 'text-neutral-white hover:text-secondary-400'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export { MainNav }
