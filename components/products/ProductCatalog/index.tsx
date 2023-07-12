'use client'

import FilterPanel from '@/components/products/FilterPanel'
import { useProductSearch } from '@/hooks/useProductSearch'
import ProductList from 'components/products/ProductList'

const ProductCatalog = () => {
  const { onNextClick, onPreviousClick, pageInfo, products, onQueryChange } =
    useProductSearch()

  return (
    <>
      <FilterPanel handleSetFilters={onQueryChange} />
      <ProductList
        className="min-h-full md:w-[840px]"
        onNextClick={onNextClick}
        onPreviousClick={onPreviousClick}
        pageInfo={pageInfo}
        products={products}
      />
    </>
  )
}

export default ProductCatalog
