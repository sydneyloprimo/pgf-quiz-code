import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import EmptyCartIcon from 'public/icons/empty-cart.svg'
import { Routes } from 'types/enums/routes'

interface EmptyStateProps {
  className?: string
}

const EmptyState = ({ className }: EmptyStateProps) => {
  const t = useTranslations('Cart.emptyState')
  return (
    <div
      className={cn(
        'flex justify-center flex-col mx-8 md:mx-0 md:flex-row',
        className
      )}
    >
      <div className="flex justify-center">
        <Image src={EmptyCartIcon} alt="" />
      </div>
      <div className="md:w-[419px]">
        <h2 className="text-2xl font-bold text-center md:text-start">
          {t('title')}
        </h2>
        <h4 className="text-lg mt-5 text-center md:text-start">
          {t('description')}
        </h4>
        <Link
          className="btn-primary py-3 px-[18px] w-max m-auto mt-8 md:ml-0"
          href={Routes.products}
          data-qa="empty-cart-state-explore-button"
        >
          {t('exploreButton')}
        </Link>
      </div>
    </div>
  )
}

export default EmptyState
