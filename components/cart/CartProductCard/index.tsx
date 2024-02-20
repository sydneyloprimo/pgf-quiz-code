'use client'
import cn from 'classnames'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { ProductVariant } from '@/shopify/generated/graphql'
import { formatCurrency } from '@/utils/helpers'
import PlusIcon from 'public/icons/plus.svg'
import SubtractIcon from 'public/icons/subtract.svg'
import TrashIcon from 'public/icons/trash.svg'

interface CartProductCardProps {
  product: ProductVariant
  className?: string
  onDecreaseClick: () => void
  onDeleteClick: () => void
  onIncreaseClick: () => void
  disabled: boolean
  quantity: number
}

const CartProductCard = ({
  product,
  className,
  onDecreaseClick,
  onIncreaseClick,
  onDeleteClick,
  disabled,
  quantity,
}: CartProductCardProps) => {
  const t = useTranslations('Cart')
  return (
    <div
      className={cn(
        'bg-white flex focus:border-dashed focus:border-2 focus:border-focus focus:outline-none md:h-auto md:focus:border-none md:focus:outline-dashed md:focus:outline-2 md:focus:outline-focus',
        className,
        { 'opacity-50': disabled }
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
          <h3 className="text-black text-sm text-start font-bold md:text-xl">
            {product.title}
          </h3>
          <button
            className="text-start w-max link-primary"
            onClick={onDeleteClick}
            disabled={disabled}
          >
            {t('deleteButton')}
          </button>
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="text-black text-sm text-end font-bold md:font-regular md:text-xl">
            {formatCurrency(product.price.currencyCode, product.price.amount)}
          </h3>
          <div className="flex justify-end">
            {quantity == 1 ? (
              <button
                className="mr-3 btn"
                type="button"
                onClick={onDeleteClick}
                disabled={disabled}
              >
                <Image src={TrashIcon} alt="" />
              </button>
            ) : (
              <button
                className="mr-3 btn"
                onClick={onDecreaseClick}
                type="button"
                disabled={disabled}
              >
                <Image src={SubtractIcon} alt="" />
              </button>
            )}
            <p className="text-black text-sm md:text-base font-bold hover:opacity-80">
              {quantity}
            </p>
            <button
              className="ml-3 btn"
              onClick={onIncreaseClick}
              type="button"
              disabled={product.quantityAvailable == quantity || disabled}
            >
              <Image src={PlusIcon} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartProductCard
