'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

import { ProductDetailFooter } from './ProductDetailFooter'
import { ProductDetailImageGallery } from './ProductDetailImageGallery'
import { ProductDetailInfo } from './ProductDetailInfo'
import { ProductDetailPanelSections } from './ProductDetailPanelSections'

import { CloseIcon } from '@/components/common/Icon'
import { SidePanel } from '@/components/common/SidePanel'
import { cn } from '@/utils/cn'

interface ProductDetailPanelData {
  mode: 'topper' | 'fullMeal' | 'alaCarte'
  recipe: 'turkey' | 'lamb'
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
  onRecipeChange?: (recipe: 'turkey' | 'lamb') => void
}

const ProductDetailPanel = ({
  isOpen,
  onClose,
  productData,
  recipeOptions,
  onRecipeChange,
}: ProductDetailPanelProps) => {
  const t = useTranslations('Common.ProductDetailPanel')
  const [selectedRecipe, setSelectedRecipe] = useState<'turkey' | 'lamb'>(
    productData?.recipe || 'turkey'
  )

  useEffect(() => {
    if (productData) {
      setSelectedRecipe(productData.recipe)
    }
  }, [productData])
  const [quantity, setQuantity] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)

  const handleRecipeSelect = useCallback(
    (value: string) => {
      const recipe = value as 'turkey' | 'lamb'
      setSelectedRecipe(recipe)
      onRecipeChange?.(recipe)
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

  if (!productData) {
    return null
  }

  const sections = [
    {
      id: 'analytical-constituents',
      title: productData.sections.analyticalConstituents.title,
      content: productData.sections.analyticalConstituents.content,
    },
    {
      id: 'nutritional-facts',
      title: productData.sections.nutritionalFacts.title,
      content: productData.sections.nutritionalFacts.content,
    },
    {
      id: 'ingredients',
      title: productData.sections.ingredients.title,
      content: productData.sections.ingredients.content,
    },
  ]

  const panelTitle =
    productData.mode === 'alaCarte'
      ? t('alaCarteTitle')
      : productData.mode === 'topper'
        ? t('topperTitle')
        : t('fullMealTitle')

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
