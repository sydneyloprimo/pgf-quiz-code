'use client'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMediaQuery } from 'usehooks-ts'

import Toast, { ToastTypes } from '@/components/common/Toast'
import { MediaQuery } from '@/constants'
import event from '@/scripts/GoogleTagManager/event'
import { Events } from '@/types/enums/events'
import useCartCookie from 'hooks/useCartCookie'
import { client } from 'shopify/client'
import {
  useCartLinesAddMutation,
  ProductVariantConnection,
  ImageConnection,
  ProductVariantEdge,
  CurrencyCode,
} from 'shopify/generated/graphql'
import { formatCurrency } from 'utils/helpers'

export const VARIANT = 'variant'

interface ProductDescriptionProps {
  description: string
  title: string
  variants: ProductVariantConnection
  images: ImageConnection
  variant?: ProductVariantEdge['node']
  handleSetVariant: (variantId: string) => void
  variantId: string
}

const ProductDescription = ({
  description,
  handleSetVariant,
  title,
  variantId,
  variants,
  variant,
}: ProductDescriptionProps) => {
  const [quantity, setQuantity] = useState(1)
  const searchParams = useSearchParams()
  const isMobile = useMediaQuery(MediaQuery.mobile)
  const { cartId } = useCartCookie()
  const hasVariants = variants.edges.length > 1

  const t = useTranslations('Detail')

  const { mutate: addLine, isLoading: isAddLineLoading } =
    useCartLinesAddMutation(client, {
      onError: () => {
        toast(
          <Toast type={ToastTypes.error} description={t('errorMessage')} />,
          {
            className: 'border-error border rounded-lg',
            position: 'bottom-center',
          }
        )
      },
      onSuccess: (data) => {
        if (
          data?.cartLinesAdd?.userErrors &&
          data?.cartLinesAdd?.userErrors.length > 0
        ) {
          return toast(
            <Toast
              type={ToastTypes.error}
              description={data.cartLinesAdd?.userErrors[0].message}
            />,
            {
              className: 'border-error border rounded-lg w-max',
              position: isMobile ? 'top-center' : 'bottom-center',
            }
          )
        }
        event(Events.addProduct, {
          quantity,
          title,
          variant_id: variantId,
          variant_name: variant?.title || '',
        })
        toast(
          <Toast
            type={ToastTypes.success}
            description={t('successMessage', { title })}
          />,
          {
            className: 'border-restored border rounded-lg w-max',
            position: isMobile ? 'top-center' : 'bottom-center',
          }
        )
      },
    })

  const onAddLineClick = () => {
    toast.dismiss()
    if (variant) {
      addLine({
        cartId,
        lines: [
          {
            merchandiseId: variant.id,
            quantity,
          },
        ],
      })
    }
  }

  useEffect(() => {
    setQuantity(1)
  }, [searchParams])

  return (
    <div className="px-4 md:px-7 flex flex-col">
      <h2
        className="text-3xl font-bold mb-2 hidden md:block order-1"
        data-qa="product-title"
      >
        {title}
      </h2>
      <p className="text-3xl font-bold mb-24 hidden md:block order-2">
        {formatCurrency(
          variant?.price.currencyCode || CurrencyCode.Usd,
          variant?.price?.amount * quantity
        )}
      </p>
      {description && (
        <div className="order-4 md:order-3">
          <h3 className="text-lg font-bold mb-3">{t('productDescription')}</h3>
          <p className="mb-4 text-base" data-qa="product-description">
            {description}
          </p>
        </div>
      )}
      {hasVariants ? (
        <div className="flex flex-1 order-3 md:order-4 my-4">
          <div className="flex-1">
            <label htmlFor="variant" className="block mb-4 font-bold">
              {t('variant')}
            </label>
            <select
              id="variant"
              value={variantId as string}
              onChange={(e) => handleSetVariant(e.target.value)}
              className="w-full border border-gray-500 h-10 rounded px-3 py-2 bg-white cursor-pointer"
              disabled={isAddLineLoading}
              data-qa="variant-select"
            >
              {variants.edges.map((variant) => (
                <option
                  key={variant.node.id}
                  value={variant.node.id}
                  data-qa="product-variant-option"
                >
                  {variant.node.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
      <div className="flex flex-1 order-3 md:order-4 my-4 md:m-0">
        {variant?.quantityAvailable === 0 ? (
          <div className="mb-2 md:mb-1">
            <p className="text-error text-base md:text-xl">{t('outOfStock')}</p>
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="quantity" className="block mb-4 font-bold">
                {t('quantity')}
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={!variant?.quantityAvailable || isAddLineLoading}
                className="w-20 border border-gray-500 h-10 rounded px-3 py-2 bg-white cursor-pointer"
                data-qa="quantity-select"
              >
                {Array.from(
                  {
                    length: Math.min(10, Number(variant?.quantityAvailable)),
                  },
                  (_, i) => (
                    <option
                      key={i}
                      value={i + 1}
                      data-qa="product-quantity-option"
                    >
                      {i + 1}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="flex-1 pl-3">
              <p className="mb-4 text-left italic">
                {t('availability', {
                  count: Number(variant?.quantityAvailable),
                })}
              </p>
              <button
                type="button"
                className="btn-primary w-full py-2 justify-center"
                onClick={onAddLineClick}
                disabled={isAddLineLoading}
                data-qa="add-to-cart-button"
              >
                {t('addToCart')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductDescription
