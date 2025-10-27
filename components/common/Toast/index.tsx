import cn from 'classnames'
import Image from 'next/image'
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
  iconAlt: string
  title: string
}

const Toast = ({
  className,
  description,
  type,
  iconAlt,
  title,
}: ToastProps) => {
  const isSuccess = type === ToastTypes.success

  return (
    <div className={cn('flex', className)}>
      <Image
        src={isSuccess ? SuccessIcon : ErrorIcon}
        height={30}
        width={30}
        alt={iconAlt}
      />
      <div className="ml-3">
        <p className="my-auto text-base font-bold text-dark-violet">{title}</p>
        <p className="text-sm text-dark-grey">{description}</p>
      </div>
    </div>
  )
}

export default Toast
