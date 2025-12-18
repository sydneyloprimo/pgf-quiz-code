'use client'

import FilterPanel from '@/components/products/FilterPanel'
import ProductList from '@/components/products/ProductList'
import { useProductSearch } from '@/hooks/useProductSearch'

export type ProductType = { name: string }

interface ProductCatalogProps {
  productTypes: ProductType[]
}

const ProductCatalog = ({ productTypes }: ProductCatalogProps) => {
  const {
    onNextClick,
    onPreviousClick,
    pageInfo,
    products,
    handleQueryChange,
  } = useProductSearch()

  return (
    <>
      <FilterPanel
        onFiltersChange={handleQueryChange}
        productTypes={productTypes}
      />
      <ProductList
        className="min-h-full md:w-[840px]"
        onNextClick={onNextClick}
        onPreviousClick={onPreviousClick}
        onSortChange={handleQueryChange}
        pageInfo={pageInfo}
        products={products}
      />
    </>
  )
}

export default ProductCatalog
