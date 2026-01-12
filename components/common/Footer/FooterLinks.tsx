import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { PGFTextLogo } from '@/components/common/Icon'
import { NAV_LINKS } from '@/constants'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

const FooterLinks = () => {
  const tNav = useTranslations('Navigation')
  const tFooter = useTranslations('Footer')

  const navLinks = NAV_LINKS.map((link) => ({
    href: link.href,
    label: tNav(link.labelKey),
  }))

  return (
    <div
      className={cn(
        'w-full lg:flex-1',
        'bg-secondary-950',
        'px-8 md:px-10 py-16 md:py-20',
        'flex flex-col justify-between gap-12',
        'min-h-80 lg:min-h-[500px]',
        'order-3 lg:order-0'
      )}
    >
      <Link href={Routes.home} aria-label={tFooter('logoAria')}>
        <PGFTextLogo className="h-11 w-auto text-neutral-white" />
      </Link>

      <nav
        className="flex flex-col gap-4"
        aria-label={tFooter('footerNavAria')}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'font-bold text-base leading-4',
              'text-quaternary-100 underline',
              'hover:text-neutral-white'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export { FooterLinks }
