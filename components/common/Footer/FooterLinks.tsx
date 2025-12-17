import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { PGFTextLogo } from '@/components/common/Icon'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

const FooterLinks = () => {
  const t = useTranslations('Footer')

  const navLinks = [
    { href: Routes.home, label: t('linkHome') },
    { href: '/recipe', label: t('linkRecipe') },
    { href: '/about', label: t('linkAbout') },
    { href: '/contact', label: t('linkContact') },
  ]

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
      <Link href={Routes.home} aria-label={t('logoAria')}>
        <PGFTextLogo className="h-11 w-auto text-neutral-white" />
      </Link>

      <nav className="flex flex-col gap-4" aria-label={t('footerNavAria')}>
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
