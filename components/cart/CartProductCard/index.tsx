'use client'
import cn from 'classnames'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { ProductVariant } from '@/shopify/generated/graphql'

interface CartProductCardProps {
  product: ProductVariant
  className?: string
  onDeleteClick: () => void
  deleteDisabled: boolean
}

const CartProductCard = ({
  product,
  className,
  onDeleteClick,
  deleteDisabled,
}: CartProductCardProps) => {
  const t = useTranslations('Cart')
  return (
    <div
      className={cn(
        'bg-white flex focus:border-dashed focus:border-2 focus:border-focus focus:outline-none md:h-auto md:focus:border-none md:focus:outline-dashed md:focus:outline-2 md:focus:outline-focus',
        className
      )}
    >
      <div className="w-[79px] h-[120px] rounded-lg relative md:w-[197px] md:h-[182px]">
        <Image
          className="md:rounded-l-lg"
          src={product.image?.url}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 120px, (min-width: 768px) 182pxw"
          alt={`${product.title} image`}
        />
      </div>
      <div className="p-[26px] md:p-10 flex justify-between flex-1">
        <div className="flex flex-col justify-between">
          <h3 className="text-sm text-start font-bold md:text-xl">
            {product.title}
          </h3>
          <button
            className="text-start w-max link-primary"
            onClick={onDeleteClick}
            disabled={deleteDisabled}
          >
            {t('deleteButton')}
          </button>
        </div>
        <div className="flex">
          <h3 className="text-sm text-start font-bold md:font-regular md:text-xl">
            {`${product.price.currencyCode} ${product.price.amount}`}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default CartProductCard
