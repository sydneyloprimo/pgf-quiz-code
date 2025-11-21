'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import PlusIcon from 'public/icons/plus.svg'
import SubtractIcon from 'public/icons/subtract.svg'
import TrashIcon from 'public/icons/trash.svg'
import { toast } from 'react-toastify'
import { useMediaQuery } from 'usehooks-ts'

import Toast, { ToastTypes } from '@/components/common/Toast'
import { MediaQuery } from '@/constants'
import { ProductVariant } from '@/shopify/generated/graphql'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/helpers'

interface CartProductCardProps {
  productVariant: ProductVariant
  className?: string
  onDecreaseClick: () => void
  onDeleteClick: () => void
  onIncreaseClick: () => void
  disabled: boolean
  quantity: number
}

const CartProductCard = ({
  productVariant,
  className,
  onDecreaseClick,
  onIncreaseClick,
  onDeleteClick,
  disabled,
  quantity,
}: CartProductCardProps) => {
  const t = useTranslations('Cart')
  const isMobile = useMediaQuery(MediaQuery.mobile)

  const onIncreaseHandler = () => {
    if (
      !!productVariant.quantityAvailable &&
      (disabled || quantity == productVariant.quantityAvailable)
    ) {
      toast(
        <Toast
          type={ToastTypes.error}
          description={t('maxStock')}
          iconAlt="Error icon"
          title="Error"
        />,
        {
          className: 'md:max-w-lg border-error border rounded-lg',
          position: isMobile ? 'top-center' : 'bottom-center',
        }
      )

      return
    }

    onIncreaseClick()
  }

  return (
    <li
      className={cn(
        'bg-white flex focus:border-dashed focus:border-2 focus:border-focus focus:outline-none md:h-auto md:focus:border-none md:focus:outline-dashed md:focus:outline-2 md:focus:outline-focus',
        className,
        { 'opacity-50': disabled }
      )}
    >
      <div className="w-[79px] h-[120px] rounded-lg relative md:w-[197px] md:h-[182px]">
        <Image
          className="md:rounded-l-lg"
          src={productVariant.image?.url}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 120px, (min-width: 768px) 182pxw"
          alt={`${productVariant.title} image`}
        />
      </div>
      <div className="p-[20px] md:p-8 flex justify-between flex-1">
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-black text-sm text-start font-bold md:text-xl">
              {productVariant.product.title}
            </h2>
            {productVariant.title !== 'Default Title' && (
              <p className="text-black text-sm text-start md:text-lg">
                {productVariant.title}
              </p>
            )}
          </div>
          <button
            className="text-start w-max text-primary-600 text-sm font-bold md:text-base disabled:text-neutral-700 hover:underline active:underline active:text-primary-600 focus:outline-dashed focus:outline-2 focus:outline-primary-600 focus:rounded-lg focus:px-1.5"
            onClick={onDeleteClick}
            disabled={disabled}
            data-qa="delete-cart-product-button"
          >
            {t('deleteButton')}
          </button>
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="text-black text-sm text-end font-bold md:font-regular md:text-xl">
            {formatCurrency(
              productVariant.price.currencyCode,
              productVariant.price.amount
            )}
          </h3>
          <div className="flex justify-end">
            {quantity == 1 ? (
              <button
                className="mr-3 btn"
                type="button"
                onClick={onDeleteClick}
                disabled={disabled}
                data-qa="delete-cart-product-trash-icon-button"
              >
                <Image src={TrashIcon} alt="" />
              </button>
            ) : (
              <button
                className="mr-3 btn"
                onClick={onDecreaseClick}
                type="button"
                disabled={disabled}
                data-qa="decrease-cart-product-button"
              >
                <Image src={SubtractIcon} alt={t('decreaseQuantity')} />
              </button>
            )}
            <p className="text-black text-sm md:text-base font-bold hover:opacity-80">
              {quantity}
            </p>
            <button
              className="ml-3 btn"
              onClick={onIncreaseHandler}
              type="button"
              data-qa="increase-cart-product-button"
            >
              <Image src={PlusIcon} alt={t('increaseQuantity')} />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default CartProductCard
