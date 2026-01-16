import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Routes } from '@/types/enums/routes'

const PasswordLabel = () => {
  const t = useTranslations('Auth')
  const tSignIn = useTranslations('SignIn')

  return (
    <div className="flex gap-2 items-center justify-between w-full">
      <div className="flex gap-1 items-center">
        <span className="text-body-m font-bold text-secondary-900">
          {t('password')}
        </span>
        <span className="text-body-m text-feedback-error-500">*</span>
      </div>
      <Link
        href={Routes.home}
        className="text-body-s text-secondary-900 underline"
      >
        {tSignIn('forgotPasswordLink')}
      </Link>
    </div>
  )
}

export { PasswordLabel }
