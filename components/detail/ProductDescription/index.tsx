import { useTranslations } from 'next-intl'

import { ProductDetail } from '@/components/detail/ProductDetail'

const selectedVariant = 0

const ProductDescription = ({
  title,
  description,
  variants,
}: ProductDetail) => {
  const t = useTranslations('Detail')

  const variant = variants.edges[selectedVariant].node

  return (
    <div className="px-4 md:px-7 flex flex-col">
      <h2 className="text-3xl font-bold mb-2 hidden md:block order-1">
        {title}
      </h2>
      <p className="text-3xl font-bold mb-24 hidden md:block order-2">{`${variant.price.currencyCode} ${variant.price.amount}`}</p>
      {description && (
        <div className="order-4 md:order-3">
          <h3 className="text-lg font-bold mb-3">{t('productDescription')}</h3>
          <p className="mb-4 text-base">{description}</p>
        </div>
      )}
      <div className="flex flex-1 order-3 md:order-4 my-4 md:m-0">
        <div>
          <label htmlFor="quantity" className="block mb-4 font-bold">
            {t('quantity')}
          </label>
          <select
            id="quantity"
            value={1}
            disabled={Boolean(variant.quantityAvailable)}
            className="w-20 border border-gray-500 h-10 rounded px-3 py-2"
          >
            {/* TODO: change to variant.quantityAvailable when available */}
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 pl-3">
          <p className="mb-4 text-center font-bold">
            {t('availability', { count: variant.quantityAvailable })}
          </p>
          <button type="button" className="btn-primary w-full justify-center">
            {t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDescription
