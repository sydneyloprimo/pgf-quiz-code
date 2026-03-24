'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { client } from 'shopify/client'
import { useCartLinesAddMutation } from 'shopify/generated/graphql'
import { useMediaQuery } from 'usehooks-ts'

import { ProductDetailFooter } from './ProductDetailFooter'
import { ProductDetailInfo } from './ProductDetailInfo'
import { ProductDetailPanelSections } from './ProductDetailPanelSections'

import { CloseIcon } from '@/components/common/Icon'
import { SidePanel } from '@/components/common/SidePanel'
import Toast, { ToastTypes } from '@/components/common/Toast'
import { calculateDailyFoodAndPrice } from '@/components/quiz/helpers'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import {
  MediaQuery,
  PRODUCT_DETAIL_DEFAULTS,
  PRODUCT_DETAIL_SECTIONS_CONFIG,
  PRODUCT_MODE,
  RECIPE_TYPE,
} from '@/constants'
import useCartCookie from '@/hooks/useCartCookie'
import { useProductConfigs } from '@/hooks/useProductConfigs'
import {
  calculatePacksForPeriod,
  generateCartPayload,
} from '@/utils/cartHelpers'
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
  onAddToCartClick?: () => void
  formData?: QuizFormData
  sellingPlanId?: string | null
  dogName?: string
}

const ProductDetailPanel = ({
  isOpen,
  onClose,
  productData,
  recipeOptions,
  onRecipeChange,
  onAddToCartClick,
  formData,
  sellingPlanId,
  dogName = '',
}: ProductDetailPanelProps) => {
  const t = useTranslations('Common.ProductDetailPanel')
  const tDetail = useTranslations('Detail')
  const tToast = useTranslations('Common.Toast')
  const isMobile = useMediaQuery(MediaQuery.mobile)
  const { cartId } = useCartCookie()
  const queryClient = useQueryClient()
  const { configs: productConfigs } = useProductConfigs()
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

  const { mutate: addLine, isPending: isAddLineLoading } =
    useCartLinesAddMutation(client, {
      onError: () => {
        toast(
          <Toast
            type={ToastTypes.error}
            description={tDetail('errorMessage')}
            iconAlt={tToast('Error.iconAlt')}
            title={tToast('Error.title')}
          />,
          {
            className: 'border-error border rounded-lg',
            position: isMobile ? 'top-center' : 'bottom-center',
          }
        )
      },
      onSuccess: (data) => {
        // Debug: Log mutation response
        if (process.env.NODE_ENV === 'development') {
          console.log('CartLinesAdd Mutation Response (ProductDetailPanel):', {
            data,
            cartIdUsed: cartId,
            cartIdFromResponse: data?.cartLinesAdd?.cart?.id,
            cartIdsMatch: cartId === data?.cartLinesAdd?.cart?.id,
            userErrors: data?.cartLinesAdd?.userErrors,
            cart: data?.cartLinesAdd?.cart,
            fullResponse: data,
          })
        }

        if (
          data?.cartLinesAdd?.userErrors &&
          data?.cartLinesAdd?.userErrors.length > 0
        ) {
          return toast(
            <Toast
              type={ToastTypes.error}
              description={data.cartLinesAdd?.userErrors[0].message}
              iconAlt={tToast('Error.iconAlt')}
              title={tToast('Error.title')}
            />,
            {
              className: 'border-error border rounded-lg w-max',
              position: isMobile ? 'top-center' : 'bottom-center',
            }
          )
        }

        // Check if cart was actually updated
        if (!data?.cartLinesAdd?.cart?.id) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Cart mutation succeeded but no cart ID returned')
          }
          return toast(
            <Toast
              type={ToastTypes.error}
              description={tDetail('errorMessage')}
              iconAlt={tToast('Error.iconAlt')}
              title={tToast('Error.title')}
            />,
            {
              className: 'border-error border rounded-lg w-max',
              position: isMobile ? 'top-center' : 'bottom-center',
            }
          )
        }

        // Use the cart ID from the mutation response if available
        const updatedCartId = data?.cartLinesAdd?.cart?.id || cartId

        // Invalidate and refetch cart queries with a small delay to ensure mutation is processed
        window.setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ['getCart'],
          })
        }, 100)

        toast(
          <Toast
            type={ToastTypes.success}
            description={tDetail('successMessage', { title: '' })}
            iconAlt={tToast('Success.iconAlt')}
            title={tToast('Success.title')}
          />,
          {
            className: 'border-restored border rounded-lg w-max',
            position: isMobile ? 'top-center' : 'bottom-center',
          }
        )
        onAddToCartClick?.()
      },
    })

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

  const handleAddToCart = useCallback(() => {
    if (!productData) {
      return
    }

    if (productData.mode === 'alaCarte') {
      if (quantity <= 0) {
        return
      }

      const productConfig =
        productConfigs?.[selectedRecipe as 'turkey' | 'lamb' | 'pancreatic'] ||
        null

      const payload = generateCartPayload({
        recipeSlug: selectedRecipe as 'turkey' | 'lamb' | 'pancreatic',
        packsPerDelivery: quantity,
        portion: 'FULL_MEAL',
        dogName,
        productConfig,
      })

      toast.dismiss()

      // Debug: Log payload being sent
      if (process.env.NODE_ENV === 'development') {
        console.log('Adding to cart (A la Carte from Panel) - Payload:', {
          cartId,
          payload,
          recipeSlug: selectedRecipe,
          packsPerDelivery: quantity,
          portion: 'FULL_MEAL',
          dogName,
        })
      }

      addLine({
        cartId,
        lines: [payload],
      })
      return
    }

    if (!formData) {
      return
    }

    const mode = productData.mode === 'topper' ? 'topper' : 'full'
    const calculationRecipe =
      selectedRecipe === 'pancreatic' ? 'turkey' : selectedRecipe
    const { dailyFoodGrams } = calculateDailyFoodAndPrice(
      formData,
      calculationRecipe,
      mode
    )

    const portion = productData.mode === 'topper' ? 'TOPPER' : 'FULL_MEAL'

    const productConfig =
      productConfigs?.[selectedRecipe as 'turkey' | 'lamb' | 'pancreatic'] ||
      null

    const plan = productConfig?.sellingPlanOptions.find(
      (p) => p.id === sellingPlanId
    )
    const daysInPeriod = plan?.daysInPeriod ?? 7
    const packsPerDelivery = calculatePacksForPeriod(
      dailyFoodGrams,
      daysInPeriod
    )

    const payload = generateCartPayload({
      recipeSlug: selectedRecipe as 'turkey' | 'lamb' | 'pancreatic',
      packsPerDelivery,
      portion,
      dogName,
      productConfig,
      sellingPlanId: sellingPlanId ?? null,
    })

    toast.dismiss()

    // Debug: Log payload being sent
    if (process.env.NODE_ENV === 'development') {
      console.log('Adding to cart (Subscription from Panel):', {
        cartId,
        payload,
        recipeSlug: selectedRecipe,
        packsPerDelivery,
        sellingPlanId,
        portion,
        dogName,
      })
    }

    addLine({
      cartId,
      lines: [payload],
    })
  }, [
    productData,
    quantity,
    selectedRecipe,
    dogName,
    formData,
    sellingPlanId,
    cartId,
    productConfigs,
    addLine,
  ])

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
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-6 px-5 pt-6 flex-1 overflow-y-auto">
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

        {productData.mode === 'alaCarte' && (
          <ProductDetailFooter
            quantity={quantity}
            onQuantityDecrement={handleQuantityDecrement}
            onQuantityIncrement={handleQuantityIncrement}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </SidePanel>
  )
}

export { ProductDetailPanel }
export type { ProductDetailPanelProps, ProductDetailPanelData }
