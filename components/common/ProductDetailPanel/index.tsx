'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

import { ProductDetailFooter } from './ProductDetailFooter'
import { ProductDetailImageGallery } from './ProductDetailImageGallery'
import { ProductDetailInfo } from './ProductDetailInfo'
import { ProductDetailPanelSections } from './ProductDetailPanelSections'

import { CloseIcon } from '@/components/common/Icon'
import { SidePanel } from '@/components/common/SidePanel'
import {
  PRODUCT_DETAIL_DEFAULTS,
  PRODUCT_DETAIL_SECTIONS_CONFIG,
  PRODUCT_MODE,
  RECIPE_TYPE,
} from '@/constants'
import { cn } from '@/utils/cn'

const isRecipe = (value: string): value is 'turkey' | 'lamb' | 'pancreatic' => {
  return (
    value === RECIPE_TYPE.turkey ||
    value === RECIPE_TYPE.lamb ||
    value === 'pancreatic'
  )
}

interface ProductDetailPanelData {
  mode: 'topper' | 'fullMeal' | 'alaCarte'
  recipe: 'turkey' | 'lamb' | 'pancreatic'
  images: {
    main: string
    thumbnails: string[]
  }
  price: string
  description: string
  sections: {
    analyticalConstituents: { title: string; content: string }
    nutritionalFacts: { title: string; content: string }
    ingredients: { title: string; content: string }
  }
}

interface ProductDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  productData: ProductDetailPanelData | null
  recipeOptions: Array<{ label: string; value: string }>
  onRecipeChange?: (recipe: 'turkey' | 'lamb' | 'pancreatic') => void
}

const ProductDetailPanel = ({
  isOpen,
  onClose,
  productData,
  recipeOptions,
  onRecipeChange,
}: ProductDetailPanelProps) => {
  const t = useTranslations('Common.ProductDetailPanel')
  const [selectedRecipe, setSelectedRecipe] = useState<
    'turkey' | 'lamb' | 'pancreatic'
  >(productData?.recipe || PRODUCT_DETAIL_DEFAULTS.recipe)

  useEffect(() => {
    if (productData) {
      setSelectedRecipe(productData.recipe)
    }
  }, [productData])
  const [quantity, setQuantity] = useState<number>(
    PRODUCT_DETAIL_DEFAULTS.quantity
  )
  const [selectedImage, setSelectedImage] = useState<number>(
    PRODUCT_DETAIL_DEFAULTS.selectedImage
  )

  const handleRecipeSelect = useCallback(
    (value: string) => {
      if (!isRecipe(value)) {
        return
      }
      setSelectedRecipe(value)
      onRecipeChange?.(value)
    },
    [onRecipeChange]
  )

  const handleQuantityDecrement = useCallback(() => {
    setQuantity((prev) => Math.max(0, prev - 1))
  }, [])

  const handleQuantityIncrement = useCallback(() => {
    setQuantity((prev) => prev + 1)
  }, [])

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedImage(index)
  }, [])

  const handleAddToCart = useCallback(() => {
    // No functionality yet
  }, [])

  const getPanelTitle = useCallback(
    (mode: 'topper' | 'fullMeal' | 'alaCarte'): string => {
      if (mode === PRODUCT_MODE.alaCarte) {
        return t('alaCarteTitle')
      }
      if (mode === PRODUCT_MODE.topper) {
        return t('topperTitle')
      }
      return t('fullMealTitle')
    },
    [t]
  )

  if (!productData) {
    return null
  }

  const sections = PRODUCT_DETAIL_SECTIONS_CONFIG.map((config) => ({
    id: config.id,
    title: productData.sections[config.sectionKey].title,
    content: productData.sections[config.sectionKey].content,
  }))

  const panelTitle = getPanelTitle(productData.mode)

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t('panelAriaLabel', { title: panelTitle })}
    >
      <div className="flex flex-col min-h-full">
        <div className="flex flex-col gap-6 px-5 pt-6 flex-1">
          <div className="flex items-center justify-between p-1">
            <p className="font-display leading-6 text-xl text-neutral-950">
              {panelTitle}
            </p>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'p-0',
                'text-neutral-950',
                'hover:text-primary-800',
                'focus:outline-none focus:ring-2 focus:ring-primary-600',
                'cursor-pointer'
              )}
              aria-label={t('closeButtonAriaLabel')}
            >
              <CloseIcon className="size-4" />
            </button>
          </div>

          <div className="flex flex-col gap-6 items-center px-0">
            <div className="flex flex-1 flex-col gap-6 items-start justify-center w-full">
              <ProductDetailImageGallery
                images={productData.images}
                selectedImage={selectedImage}
                onThumbnailClick={handleThumbnailClick}
              />

              <ProductDetailInfo
                selectedRecipe={selectedRecipe}
                recipeOptions={recipeOptions}
                onRecipeSelect={handleRecipeSelect}
                description={productData.description}
                price={productData.price}
              />
            </div>

            <div className="flex flex-col gap-6 items-start w-full pb-14">
              <ProductDetailPanelSections sections={sections} />
            </div>
          </div>
        </div>

        <ProductDetailFooter
          quantity={quantity}
          onQuantityDecrement={handleQuantityDecrement}
          onQuantityIncrement={handleQuantityIncrement}
          onAddToCart={handleAddToCart}
        />
      </div>
    </SidePanel>
  )
}

export { ProductDetailPanel }
export type { ProductDetailPanelProps, ProductDetailPanelData }
