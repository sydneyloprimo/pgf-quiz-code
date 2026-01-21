import { useTranslations } from 'next-intl'

const EmailLabel = () => {
  const t = useTranslations('Auth')

  return (
    <div className="flex gap-1 items-center">
      <span className="text-body-m font-bold text-secondary-900">
        {t('email')}
      </span>
      <span className="text-body-m text-feedback-error-500">*</span>
    </div>
  )
}

export { EmailLabel }
