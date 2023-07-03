import cn from 'classnames'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import ErrorIcon from 'public/icons/error.svg'
import SuccessIcon from 'public/icons/success.svg'

export enum ToastTypes {
  error = 'Error',
  success = 'Success',
}

interface ToastProps {
  className?: string
  description?: string
  type: ToastTypes
}

const Toast = ({ className, description, type }: ToastProps) => {
  const isSuccess = type === ToastTypes.success

  const t = useTranslations(`Common.Toast.${isSuccess ? 'Success' : 'Error'}`)
  return (
    <div className={cn('flex', className)}>
      <Image
        src={isSuccess ? SuccessIcon : ErrorIcon}
        height={30}
        width={30}
        alt={t('iconAlt')}
      />
      <div className="ml-3">
        <p className="my-auto text-base font-bold text-dark-violet">
          {t('title')}
        </p>
        <p className="text-sm text-dark-grey">{description}</p>
      </div>
    </div>
  )
}

export default Toast
