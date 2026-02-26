import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { PGFTextLogo } from '@/components/common/Icon'
import { FOOTER_SOCIAL_LINKS, NAV_LINKS } from '@/constants'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

const FooterLinks = () => {
  const tNav = useTranslations('Navigation')
  const tFooter = useTranslations('Footer')

  const navLinks = NAV_LINKS.map((link) => ({
    href: link.href,
    labelKey: link.labelKey,
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
            key={link.labelKey}
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

      <div className="flex gap-6">
        {FOOTER_SOCIAL_LINKS.map((social) => {
          const isExternal = !social.href.startsWith('mailto:')
          return (
            <Link
              key={social.id}
              href={social.href}
              {...(isExternal && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
              aria-label={tFooter(social.ariaLabelKey)}
              className="text-neutral-white hover:opacity-80"
            >
              <Image
                src={social.iconPath}
                alt=""
                width={24}
                height={24}
                aria-hidden
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export { FooterLinks }
