import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

import { formatCurrency } from '@/utils/utils'
import {
  ProductVariantConnection,
  ImageConnection,
} from 'shopify/generated/graphql'

export const VARIANT = 'variant'

interface ProductDescriptionProps {
  description: string
  title: string
  variants: ProductVariantConnection
  images: ImageConnection
  handleSetVariant: (variantId: string) => void
  variantId: string
}

const ProductDescription = ({
  title,
  description,
  handleSetVariant,
  variantId,
  variants,
}: ProductDescriptionProps) => {
  const [quantity, setQuantity] = useState(1)

  const searchParams = useSearchParams()
  const t = useTranslations('Detail')

  const variantInfo = useMemo(
    () => variants.edges.find(({ node: { id } }) => id === variantId)?.node,
    [variantId, variants]
  )

  useEffect(() => {
    setQuantity(1)
  }, [searchParams])

  useEffect(() => {
    if (!searchParams.get(VARIANT) && variantId) {
      handleSetVariant(variantId)
    }
  }, [])

  if (!variantInfo) {
    return null
  }

  return (
    <div className="px-4 md:px-7 flex flex-col">
      <h2 className="text-3xl font-bold mb-2 hidden md:block order-1">
        {title}
      </h2>
      <p className="text-3xl font-bold mb-24 hidden md:block order-2">
        {formatCurrency(
          variantInfo.price.currencyCode,
          variantInfo.price.amount * quantity
        )}
      </p>
      {description && (
        <div className="order-4 md:order-3">
          <h3 className="text-lg font-bold mb-3">{t('productDescription')}</h3>
          <p className="mb-4 text-base">{description}</p>
        </div>
      )}
      <div className="flex flex-1 order-3 md:order-4 my-4 md:m-0">
        <div>
          <label htmlFor="variant" className="block mb-4 font-bold">
            {t('variant')}
          </label>
          <select
            id="variant"
            value={variantId as string}
            onChange={(e) => handleSetVariant(e.target.value)}
            className="w-20 border border-gray-500 h-10 rounded px-3 py-2"
          >
            {variants.edges.map((variant) => (
              <option key={variant.node.id} value={variant.node.id}>
                {variant.node.title}
              </option>
            ))}
          </select>
        </div>
        <div className="pl-3">
          <label htmlFor="quantity" className="block mb-4 font-bold">
            {t('quantity')}
          </label>
          <select
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={!Boolean(variantInfo.quantityAvailable)}
            className="w-20 border border-gray-500 h-10 rounded px-3 py-2"
          >
            {Array.from(
              { length: Number(variantInfo.quantityAvailable) },
              (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              )
            )}
          </select>
        </div>
        <div className="flex-1 pl-3">
          <p className="mb-4 text-center font-bold">
            {t('availability', {
              count: Number(variantInfo.quantityAvailable),
            })}
          </p>
          <button
            type="button"
            className="btn-primary w-full py-2 justify-center"
          >
            {t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDescription
