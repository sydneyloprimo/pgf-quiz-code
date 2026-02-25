'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWatch, UseFormReturn } from 'react-hook-form'
import { toast } from 'react-toastify'
import { client } from 'shopify/client'
import {
  useCartLinesAddMutation,
  useCartLinesRemoveMutation,
  useGetCartQuery,
} from 'shopify/generated/graphql'
import { useMediaQuery } from 'usehooks-ts'

import { OptionSelectProduct } from '@/components/common/OptionSelectProduct'
import {
  ProductDetailPanel,
  ProductDetailPanelData,
} from '@/components/common/ProductDetailPanel'
import { PromiseOfCareAlert } from '@/components/common/PromiseOfCareAlert'
import { ShoppingCartPanel } from '@/components/common/ShoppingCartPanel'
import Toast, { ToastTypes } from '@/components/common/Toast'
import { FloatingCartButton } from '@/components/quiz/FloatingCartButton'
import {
  calculateDailyFoodAndPrice,
  getQuizBenefits,
  getQuizBenefitsAlaCarte,
} from '@/components/quiz/helpers'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizResultsFooter } from '@/components/quiz/QuizResultsFooter'
import { QuizResultsHeader } from '@/components/quiz/QuizResultsHeader'
import {
  MediaQuery,
  PRODUCT_DETAIL_IMAGES,
  PRODUCT_MODE,
  QUIZ_RESULT_PRODUCTS,
  QUIZ_RESULTS_DEFAULTS,
  RECIPE_TYPE,
  SHIPMENT_FREQUENCY,
} from '@/constants'
import useCartCookie from '@/hooks/useCartCookie'
import { useProductConfigs } from '@/hooks/useProductConfigs'
import useShoppingCartPanel from '@/hooks/useShoppingCartPanel'
import { QuizStep } from '@/types/enums/constants'
import { calculateWeeklyPacks, generateCartPayload } from '@/utils/cartHelpers'
import { cn } from '@/utils/cn'

interface QuizResultsProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

type ProductMode = 'topper' | 'fullMeal' | 'alaCarte'
type Recipe = 'turkey' | 'lamb' | 'pancreatic'

const QuizResults = ({ formMethods }: QuizResultsProps) => {
  const { control } = formMethods
  const t = useTranslations('Quiz.results')
  const tPanel = useTranslations('Common.ProductDetailPanel')
  const tToast = useTranslations('Common.Toast')
  const tDetail = useTranslations('Detail')

  const formData = useWatch({ control }) as QuizFormData

  const [selectedProductMode, setSelectedProductMode] = useState<ProductMode>(
    QUIZ_RESULTS_DEFAULTS.productMode
  )
  const [recipes, setRecipes] = useState<Record<ProductMode, Recipe>>({
    topper: QUIZ_RESULTS_DEFAULTS.recipe,
    fullMeal: QUIZ_RESULTS_DEFAULTS.recipe,
    alaCarte: QUIZ_RESULTS_DEFAULTS.recipe,
  })
  const [shipmentFrequencies, setShipmentFrequencies] = useState<
    Record<'topper' | 'fullMeal', string>
  >({
    topper: QUIZ_RESULTS_DEFAULTS.shipmentFrequency,
    fullMeal: QUIZ_RESULTS_DEFAULTS.shipmentFrequency,
  })
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [panelProductData, setPanelProductData] =
    useState<ProductDetailPanelData | null>(null)
  const { isOpen: isCartOpen, openCart, closeCart } = useShoppingCartPanel()
  const { cartId } = useCartCookie()
  const isMobile = useMediaQuery(MediaQuery.mobile)
  const { configs: productConfigs, isLoading: isLoadingConfigs } =
    useProductConfigs()

  useEffect(() => {
    openCart()
  }, [openCart])

  const recipeOptions = useMemo(
    () => [
      {
        label: t('recipes.turkey'),
        value: RECIPE_TYPE.turkey,
      },
      {
        label: t('recipes.lamb'),
        value: RECIPE_TYPE.lamb,
      },
      {
        label: t('recipes.pancreatic'),
        value: 'pancreatic',
      },
    ],
    [t]
  )

  const shipmentFrequencyOptions = useMemo(
    () => [
      {
        label: t('shipmentFrequencies.everyWeek'),
        value: SHIPMENT_FREQUENCY.everyWeek,
      },
      {
        label: t('shipmentFrequencies.everyTwoWeeks'),
        value: SHIPMENT_FREQUENCY.everyTwoWeeks,
      },
    ],
    [t]
  )

  const handleProductModeSelect = useCallback((mode: ProductMode) => {
    setSelectedProductMode(mode)
  }, [])

  const handleRecipeSelect = useCallback((mode: ProductMode, value: string) => {
    setRecipes((prev) => ({ ...prev, [mode]: value as Recipe }))
  }, [])

  const handleShipmentFrequencySelect = useCallback(
    (mode: 'topper' | 'fullMeal', value: string) => {
      setShipmentFrequencies((prev) => ({ ...prev, [mode]: value }))
    },
    []
  )

  const dogName = formData.name || ''

  const getPricePerDay = useCallback(
    (mode: ProductMode, recipeOverride?: Recipe): number => {
      if (mode === PRODUCT_MODE.alaCarte) {
        return 0
      }

      // Return 0 if configs are still loading
      if (isLoadingConfigs) {
        return 0
      }

      const recipe = recipeOverride ?? recipes[mode]
      const calculationMode = mode === PRODUCT_MODE.topper ? 'topper' : 'full'
      // Use turkey for daily food calculation when pancreatic (same formula)
      const calculationRecipe = recipe === 'pancreatic' ? 'turkey' : recipe

      // Get product config for this recipe (pancreatic has its own config)
      const productConfig = productConfigs?.[recipe] || productConfigs?.turkey

      if (!productConfig) {
        // Fallback: return 0 if config not loaded (prices will show as $0.00)
        // This prevents errors while data is loading
        return 0
      }

      // Get shipment frequency for this mode
      const frequency = shipmentFrequencies[mode]
      // Check if frequency is 'everyWeek' (from SHIPMENT_FREQUENCY enum)
      const isWeekly =
        frequency === 'everyWeek' || frequency === SHIPMENT_FREQUENCY.everyWeek

      // Get perDeliveryPrice from selling plan
      const sellingPlanPrice = isWeekly
        ? productConfig.sellingPlanPrices.weekly
        : productConfig.sellingPlanPrices.biweekly

      if (!sellingPlanPrice) {
        // Fallback: return 0 if selling plan price not available
        // This prevents errors while data is loading
        return 0
      }

      // Calculate weekly packs needed
      const { dailyFoodGrams } = calculateDailyFoodAndPrice(
        formData,
        calculationRecipe,
        calculationMode
      )
      const calculatedWeeklyPacks = calculateWeeklyPacks(dailyFoodGrams)

      // Calculate weekly total: perDeliveryPrice × quantity
      const weeklyTotal =
        sellingPlanPrice.perDeliveryPrice * calculatedWeeklyPacks

      // Calculate daily price: weeklyTotal / 7
      const pricePerDay = weeklyTotal / 7

      return pricePerDay
    },
    [recipes, formData, productConfigs, shipmentFrequencies, isLoadingConfigs]
  )

  const getProductDescription = useCallback(
    (recipeType: Recipe): string => {
      if (recipeType === RECIPE_TYPE.turkey) {
        return t('products.turkeyDescription')
      }
      if (recipeType === 'pancreatic') {
        return t('products.pancreaticDescription')
      }
      return t('products.lambDescription')
    },
    [t]
  )

  const getProductPrice = useCallback(
    (productMode: ProductMode, recipeOverride?: Recipe): string => {
      if (productMode === PRODUCT_MODE.alaCarte) {
        const recipe = recipeOverride ?? recipes.alaCarte
        const config = productConfigs?.[recipe] || productConfigs?.turkey
        const unitPrice = config?.unitPrice
        if (unitPrice?.amount != null) {
          return unitPrice.currencyCode === 'USD'
            ? `$${unitPrice.amount.toFixed(2)}`
            : `${unitPrice.currencyCode} ${unitPrice.amount.toFixed(2)}`
        }
        return '-'
      }
      const pricePerDay = getPricePerDay(productMode, recipeOverride)
      return `$${pricePerDay.toFixed(2)} / day`
    },
    [getPricePerDay, productConfigs, recipes.alaCarte]
  )

  const handleDetailsClick = useCallback(
    (mode: ProductMode) => {
      const recipe = recipes[mode]
      const productConfig = productConfigs?.[recipe] || productConfigs?.turkey

      // Use Shopify images if available, fallback to hardcoded
      const shopifyImages = productConfig?.images || []
      const mainImage = shopifyImages[0]?.url || PRODUCT_DETAIL_IMAGES.main
      const thumbnails =
        shopifyImages.length > 0
          ? shopifyImages.map((img) => img.url)
          : [
              PRODUCT_DETAIL_IMAGES.main,
              PRODUCT_DETAIL_IMAGES.thumbnail2,
              PRODUCT_DETAIL_IMAGES.thumbnail3,
            ]

      const productData: ProductDetailPanelData = {
        mode,
        recipe,
        images: {
          main: mainImage,
          thumbnails,
        },
        price: getProductPrice(mode),
        description: getProductDescription(recipe),
        sections: {
          analyticalConstituents: {
            title: tPanel('analyticalConstituentsTitle'),
            content: tPanel('analyticalConstituentsContent'),
          },
          nutritionalFacts: {
            title: tPanel('nutritionalFactsTitle'),
            content: tPanel('nutritionalFactsContent'),
          },
          ingredients: {
            title: tPanel('ingredientsTitle'),
            content: tPanel('ingredientsContent'),
          },
        },
      }

      setPanelProductData(productData)
      setIsPanelOpen(true)
    },
    [recipes, getProductPrice, getProductDescription, tPanel, productConfigs]
  )

  const handlePanelClose = useCallback(() => {
    setIsPanelOpen(false)
  }, [])

  const handlePanelRecipeChange = useCallback(
    (recipe: 'turkey' | 'lamb' | 'pancreatic') => {
      if (!panelProductData) return

      const productConfig = productConfigs?.[recipe] || productConfigs?.turkey

      const shopifyImages = productConfig?.images || []
      const mainImage = shopifyImages[0]?.url || PRODUCT_DETAIL_IMAGES.main
      const thumbnails =
        shopifyImages.length > 0
          ? shopifyImages.map((img) => img.url)
          : [
              PRODUCT_DETAIL_IMAGES.main,
              PRODUCT_DETAIL_IMAGES.thumbnail2,
              PRODUCT_DETAIL_IMAGES.thumbnail3,
            ]

      const updatedData: ProductDetailPanelData = {
        ...panelProductData,
        recipe,
        images: { main: mainImage, thumbnails },
        price: getProductPrice(panelProductData.mode, recipe as Recipe),
        description:
          recipe === 'pancreatic'
            ? t('products.turkeyDescription')
            : getProductDescription(recipe),
      }

      setPanelProductData(updatedData)
      setRecipes((prev) => ({
        ...prev,
        [panelProductData.mode]: recipe as Recipe,
      }))
    },
    [
      panelProductData,
      productConfigs,
      getProductPrice,
      getProductDescription,
      t,
    ]
  )
  const queryClient = useQueryClient()

  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Get current cart to check for existing lines and remove zero-quantity lines
  const { data: cartData } = useGetCartQuery(client, { id: cartId })

  const { mutate: removeLine } = useCartLinesRemoveMutation(client, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getCart'] })
    },
  })

  // Helper function to detect existing subscription in cart
  const getExistingSubscription = useMemo(() => {
    const cart = cartData?.cart
    if (!cart?.lines?.edges) {
      return null
    }

    for (const { node } of cart.lines.edges) {
      // Check if this line is a subscription (has sellingPlanAllocation)
      if (node.sellingPlanAllocation) {
        // Find the Portion attribute
        const portionAttribute = node.attributes?.find(
          (attr) => attr.key === 'Portion'
        )
        if (portionAttribute?.value === 'TOPPER') {
          return { type: 'topper' as const, lineId: node.id }
        }
        if (portionAttribute?.value === 'FULL_MEAL') {
          return { type: 'fullMeal' as const, lineId: node.id }
        }
      }
    }

    return null
  }, [cartData])

  const { mutate: addLine, isPending: isAddLineLoading } =
    useCartLinesAddMutation(client, {
      onError: (error) => {
        setIsAddingToCart(false)
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
        const cart = data?.cartLinesAdd?.cart
        if (!cart?.id) {
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

        // Check if items were actually added
        if (cart?.totalQuantity === 0 || !cart?.lines?.edges?.length) {
          setIsAddingToCart(false)
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

        setIsAddingToCart(false)

        // Use the cart ID from the mutation response if available
        const updatedCartId = data?.cartLinesAdd?.cart?.id || cartId

        // Invalidate and refetch cart queries with a small delay
        // to ensure mutation is processed
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
        openCart()
      },
    })

  const handleSubscribeClick = useCallback(
    (mode: 'topper' | 'fullMeal') => {
      const recipe = recipes[mode]
      const calculationMode = mode === 'topper' ? 'topper' : 'full'
      const calculationRecipe = recipe === 'pancreatic' ? 'turkey' : recipe
      const { dailyFoodGrams } = calculateDailyFoodAndPrice(
        formData,
        calculationRecipe,
        calculationMode
      )
      const calculatedWeeklyPacks = calculateWeeklyPacks(dailyFoodGrams)

      const frequency =
        shipmentFrequencies[mode] === 'everyWeek' ? 'WEEKLY' : 'BIWEEKLY'
      const portion = mode === 'topper' ? 'TOPPER' : 'FULL_MEAL'

      const productConfig =
        productConfigs?.[recipe as 'turkey' | 'lamb' | 'pancreatic'] || null

      const payload = generateCartPayload({
        recipeSlug: recipe as 'turkey' | 'lamb' | 'pancreatic',
        calculatedWeeklyPacks,
        frequency,
        portion,
        dogName,
        productConfig,
      })

      if (isAddingToCart || isAddLineLoading) {
        return
      }

      setIsAddingToCart(true)
      toast.dismiss()

      // First, remove any lines with quantity 0
      const cart = cartData?.cart
      const zeroQuantityLineIds =
        cart?.lines?.edges
          ?.filter(({ node }) => node.quantity === 0)
          .map(({ node }) => node.id) || []

      // Remove existing subscription if switching types
      const subscriptionLineIds: string[] = []
      if (getExistingSubscription) {
        subscriptionLineIds.push(getExistingSubscription.lineId)
      }

      const allLineIdsToRemove = [
        ...zeroQuantityLineIds,
        ...subscriptionLineIds,
      ]

      if (allLineIdsToRemove.length > 0) {
        removeLine({
          cartId,
          lineIds: allLineIdsToRemove,
        })
      }

      // Add the line after removing existing subscription
      // and zero-quantity lines
      window.setTimeout(
        () => {
          addLine({
            cartId,
            lines: [payload],
          })
        },
        allLineIdsToRemove.length > 0 ? 200 : 0
      )
    },
    [
      recipes,
      formData,
      shipmentFrequencies,
      dogName,
      cartId,
      addLine,
      removeLine,
      isAddingToCart,
      isAddLineLoading,
      cartData,
      getExistingSubscription,
      productConfigs,
    ]
  )

  const handleAddToCartClick = useCallback(() => {
    if (selectedProductMode !== 'alaCarte') {
      return
    }

    if (isAddingToCart || isAddLineLoading) {
      return
    }

    setIsAddingToCart(true)

    // First, remove any lines with quantity 0
    const cart = cartData?.cart
    const zeroQuantityLineIds =
      cart?.lines?.edges
        ?.filter(({ node }) => node.quantity === 0)
        .map(({ node }) => node.id) || []

    if (zeroQuantityLineIds.length > 0) {
      removeLine({
        cartId,
        lineIds: zeroQuantityLineIds,
      })
    }

    const recipe = recipes.alaCarte

    const productConfig =
      productConfigs?.[recipe as 'turkey' | 'lamb' | 'pancreatic'] || null

    const payload = generateCartPayload({
      recipeSlug: recipe as 'turkey' | 'lamb' | 'pancreatic',
      calculatedWeeklyPacks: 1,
      frequency: 'ONETIME',
      portion: 'FULL_MEAL',
      dogName,
      productConfig,
    })

    toast.dismiss()

    // Add the line after removing zero-quantity lines
    // (with a small delay to ensure removal completes)
    window.setTimeout(
      () => {
        addLine({
          cartId,
          lines: [payload],
        })
      },
      zeroQuantityLineIds.length > 0 ? 200 : 0
    )
  }, [
    selectedProductMode,
    recipes,
    dogName,
    cartId,
    addLine,
    removeLine,
    isAddingToCart,
    isAddLineLoading,
    cartData,
    productConfigs,
  ])

  const getBenefits = useCallback(
    (mode: 'topper' | 'fullMeal') => {
      const shipmentFrequency = shipmentFrequencies[mode]
      return getQuizBenefits(shipmentFrequency, dogName, t)
    },
    [shipmentFrequencies, dogName, t]
  )

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'md:max-w-2xl mx-auto pb-12 w-full',
        'gap-16'
      )}
    >
      <QuizResultsHeader formData={formData} />

      <PromiseOfCareAlert />

      <div className="w-full flex flex-col gap-6">
        {QUIZ_RESULT_PRODUCTS.map((product) => {
          const isSelected = selectedProductMode === product.mode
          const mode = product.mode as 'topper' | 'fullMeal'
          const title =
            product.mode === PRODUCT_MODE.fullMeal
              ? t(product.titleKey, { name: dogName })
              : t(product.titleKey)
          const description = t(product.descriptionKey, { name: dogName })
          const imageAlt =
            product.mode === PRODUCT_MODE.fullMeal
              ? t(product.titleKey, { name: dogName })
              : t(product.titleKey)

          // Use hardcoded image path
          const imageSrc = product.imageSrc

          // Determine subscription button state
          const existingSubscription = getExistingSubscription
          const isCurrentSubscription = existingSubscription?.type === mode
          const isOtherSubscription =
            existingSubscription && existingSubscription.type !== mode
          const subscribeButtonDisabled = isCurrentSubscription
          const pricePerDay = getPricePerDay(mode)
          const subscribeButtonText = isCurrentSubscription
            ? t('subscribeButtonAlreadyInCart')
            : isOtherSubscription
              ? mode === 'fullMeal'
                ? t('subscribeButtonSwitchToFullMeal', {
                    price: `$${pricePerDay.toFixed(2)}`,
                  })
                : t('subscribeButtonSwitchToTopper', {
                    price: `$${pricePerDay.toFixed(2)}`,
                  })
              : undefined

          return (
            <OptionSelectProduct
              key={product.mode}
              isSelected={isSelected}
              onSelect={() => handleProductModeSelect(product.mode)}
              title={title}
              description={description}
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              isMostPopular={product.isMostPopular}
              recipeOptions={recipeOptions}
              recipeValue={recipes[product.mode]}
              onRecipeSelect={(value) =>
                handleRecipeSelect(product.mode, value)
              }
              shipmentFrequencyOptions={shipmentFrequencyOptions}
              shipmentFrequencyValue={shipmentFrequencies[mode]}
              onShipmentFrequencySelect={(value) =>
                handleShipmentFrequencySelect(mode, value)
              }
              benefits={getBenefits(mode)}
              pricePerDay={getPricePerDay(mode)}
              onDetailsClick={() => handleDetailsClick(product.mode)}
              onSubscribeClick={() => handleSubscribeClick(mode)}
              subscribeButtonDisabled={subscribeButtonDisabled}
              subscribeButtonText={subscribeButtonText}
            />
          )
        })}
      </div>

      <div className="w-full flex flex-col gap-6">
        <OptionSelectProduct
          isSelected={selectedProductMode === PRODUCT_MODE.alaCarte}
          onSelect={() => handleProductModeSelect(PRODUCT_MODE.alaCarte)}
          title={t('products.alaCarte.title')}
          description={t('products.alaCarte.description')}
          imageSrc="/images/product-full-meal.png"
          imageAlt={t('products.alaCarte.title')}
          isMostPopular={false}
          isAlaCarte={true}
          recipeOptions={recipeOptions}
          recipeValue={recipes.alaCarte}
          onRecipeSelect={(value) =>
            handleRecipeSelect(PRODUCT_MODE.alaCarte, value)
          }
          benefits={getQuizBenefitsAlaCarte(t)}
          onDetailsClick={() => handleDetailsClick(PRODUCT_MODE.alaCarte)}
          onAddToCartClick={handleAddToCartClick}
        />
      </div>
      <QuizResultsFooter dogName={dogName} />

      <ProductDetailPanel
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        productData={panelProductData}
        recipeOptions={recipeOptions}
        onRecipeChange={handlePanelRecipeChange}
        onAddToCartClick={openCart}
        formData={formData}
        shipmentFrequency={
          panelProductData?.mode === 'topper'
            ? shipmentFrequencies.topper
            : panelProductData?.mode === 'fullMeal'
              ? shipmentFrequencies.fullMeal
              : undefined
        }
        dogName={dogName}
      />

      <ShoppingCartPanel isOpen={isCartOpen} onClose={closeCart} />
      <FloatingCartButton onOpenCart={openCart} isCartOpen={isCartOpen} />
    </div>
  )
}

export { QuizResults }
