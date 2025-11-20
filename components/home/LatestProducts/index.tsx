import { useTranslations } from 'next-intl'

import { ButtonPrimary } from '@/components/common/Button'
import ProductCard from '@/components/common/ProductCard'
import { Product, ProductEdge } from '@/shopify/generated/graphql'
import { Routes } from '@/types/enums/routes'

interface LatestProductsProps {
  products: ProductEdge[]
}

const LatestProducts = ({ products }: LatestProductsProps) => {
  const t = useTranslations('Home.LatestProducts')

  return (
    <div className="w-full flex flex-col md:flex-row p-4 md:py-14 md:px-24 bg-white gap-16 h-fit items-center">
      <div className="flex flex-col items-center md:items-start gap-6 w-[355px]">
        <h1 className="text-xl text-dark-violet font-bold md:text-3xl">
          {t('title')}
        </h1>
        <span className="text-dark-grey text-base md:text-lg text-center md:text-left">
          {t('description')}
        </span>
        <ButtonPrimary
          href={Routes.products}
          className="w-max p-[10px] outline-dark-violet! md:mt-4"
        >
          {t('button')}
        </ButtonPrimary>
      </div>
      <div className="flex flex-row flex-1 justify-center">
        <div className="flex flex-row justify-center gap-4 md:gap-12 flex-wrap md:flex-nowrap">
          {products?.map(({ node: product }) => (
            <ProductCard product={product as Product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LatestProducts
