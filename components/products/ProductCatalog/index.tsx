'use client'
import { useState } from 'react'

import FilterPanel from '@/components/products/FilterPanel'
import { Filters } from '@/hooks/useProductSearch'
import ProductList from 'components/products/ProductList'

const ProductCatalog = () => {
  const [filters, setFilters] = useState<Filters>({})

  return (
    <>
      <FilterPanel handleSetFilters={setFilters} />
      <ProductList filters={filters} className="min-h-full md:w-[840px]" />
    </>
  )
}

export default ProductCatalog
