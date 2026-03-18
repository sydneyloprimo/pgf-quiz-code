'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'
import { client } from 'shopify/client'
import {
  useGetCartQuery,
  useCartBuyerIdentityUpdateMutation,
  useCartLinesUpdateMutation,
  useCartLinesRemoveMutation,
  useCartLinesAddMutation,
  type CartLineEdge,
} from 'shopify/generated/graphql'

import { ShoppingCartFooter } from './ShoppingCartFooter'
import { ShoppingCartItem } from './ShoppingCartItem'

import { CloseIcon } from '@/components/common/Icon'
import { SidePanel } from '@/components/common/SidePanel'
import Toast, { ToastTypes } from '@/components/common/Toast'
import { calculateDailyFoodAndPrice } from '@/components/quiz/helpers'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { PRODUCT_CONFIGS } from '@/constants'
import useCartCookie from '@/hooks/useCartCookie'
import { useProductConfigs, SellingPlanOption } from '@/hooks/useProductConfigs'
import { Cookies } from '@/types/enums/cookies'
import {
  isProductVariant,
  isSellingPlanAllocation,
} from '@/types/guards/products'
import {
  generateCartPayload,
  getRecipeSlugFromTitle,
  RecipeSlug,
  calculatePacksForPeriod,
  getRecipeSlugFromVariantId,
  type ProductMode,
} from '@/utils/cartHelpers'
import { cn } from '@/utils/cn'
import { findProductLine } from '@/utils/utils'

interface ShoppingCartPanelProps {
  isOpen: boolean
  onClose: () => void
  formData: QuizFormData
  mode: ProductMode
}

function getPacksPerDelivery(
  formData: QuizFormData,
  recipeSlug: RecipeSlug,
  mode: 'topper' | 'full',
  daysInPeriod: number
): number {
  const calculationRecipe =
    recipeSlug === 'pancreatic' ? 'turkey' : (recipeSlug as 'turkey' | 'lamb')
  const calculationMode = mode
  const { dailyFoodGrams } = calculateDailyFoodAndPrice(
    formData,
    calculationRecipe,
    calculationMode
  )
  return calculatePacksForPeriod(dailyFoodGrams, daysInPeriod)
}

const ShoppingCartPanel = ({
  isOpen,
  onClose,
  formData,
  mode,
}: ShoppingCartPanelProps) => {
  const t = useTranslations('Common.ShoppingCartPanel')
  const tToast = useTranslations('Common.Toast')
  const { cartId } = useCartCookie()
  const queryClient = useQueryClient()
  const { configs: productConfigs, availableRecipes } = useProductConfigs()
  const planOptionsByRecipe = useMemo(() => {
    if (!productConfigs) {
      return {}
    }

    return Object.fromEntries(
      Object.entries(productConfigs).map(([recipe, config]) => [
        recipe,
        (config?.sellingPlanOptions ?? []).map(
          (product: SellingPlanOption) => ({
            label: product.name,
            value: product.id,
          })
        ),
      ])
    )
  }, [productConfigs])

  const recipeOptionsForCart = useMemo(
    () =>
      (
        [
          { label: t('recipeTurkey'), value: 'turkey' },
          { label: t('recipeLamb'), value: 'lamb' },
          { label: t('recipePancreatic'), value: 'pancreatic' },
        ] as Array<{ label: string; value: string }>
      ).filter((opt) =>
        availableRecipes.includes(opt.value as 'turkey' | 'lamb' | 'pancreatic')
      ),
    [t, availableRecipes]
  )

  const [cookies] = useCookies([Cookies.customerAccessToken])
  const customerAccessToken = cookies[Cookies.customerAccessToken]

  const {
    data,
    refetch: getCartRefetch,
    isLoading: isGetCartLoading,
    error: cartError,
    isError: isCartError,
  } = useGetCartQuery(
    client,
    { id: cartId },
    {
      enabled: !!cartId,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  )

  const [hasMounted, setHasMounted] = useState(false)
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null)
  const [failedFrequencyLineId, setFailedFrequencyLineId] = useState<
    string | null
  >(null)
  // Track if we're doing a recipe swap (add new + remove old)
  // This prevents refetching cart between add and remove operations
  const [isRecipeSwapInProgress, setIsRecipeSwapInProgress] = useState(false)

  // Refetch cart when panel opens or cartId changes
  useEffect(() => {
    if (isOpen && cartId) {
      // Invalidate all cart queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ['getCart'],
      })
      // Also explicitly refetch
      getCartRefetch()
    }
  }, [isOpen, cartId, getCartRefetch, queryClient])

  // Clear updating state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setUpdatingLineId(null)
      setFailedFrequencyLineId(null)
      setIsRecipeSwapInProgress(false)
    }
  }, [isOpen])

  // Debug: Log cart data
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const validEdgesCount =
        data?.cart?.lines?.edges?.filter(({ node }) => node.quantity > 0)
          .length || 0
      const cartIsNull = data?.cart === null
      const cartIsUndefined = data?.cart === undefined

      console.log('ShoppingCartPanel - Cart data:', {
        cartId,
        hasCartId: !!cartId,
        cart: data?.cart,
        cartIsNull,
        cartIsUndefined,
        cartIdFromData: data?.cart?.id,
        edges: data?.cart?.lines?.edges,
        edgesLength: data?.cart?.lines?.edges?.length,
        validEdgesCount,
        totalQuantity: data?.cart?.totalQuantity,
        isEmpty:
          (data?.cart?.totalQuantity ?? 0) === 0 || validEdgesCount === 0,
        isLoading: isGetCartLoading,
        isError: isCartError,
        error: cartError,
        isOpen,
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : [],
        fullData: data,
      })

      // If cart is null, it means the cart doesn't exist - we should create a new one
      if (cartIsNull && cartId) {
        console.warn('Cart is null - cart may not exist:', { cartId })
      }
    }
  }, [data, cartId, isGetCartLoading, isOpen, isCartError, cartError])

  const {
    mutate: updateCartIdentityForCheckout,
    isPending: isCheckoutLoading,
  } = useCartBuyerIdentityUpdateMutation(client)

  const { mutate: updateLine, isPending: isUpdateLoading } =
    useCartLinesUpdateMutation(client, {
      onSuccess: () => {
        getCartRefetch()
        setUpdatingLineId(null)
      },
      onError: () => {
        setUpdatingLineId(null)
      },
    })

  const { mutate: removeLine, isPending: isRemoveLoading } =
    useCartLinesRemoveMutation(client, {
      onSuccess: () => {
        // Clear updating state after old line is successfully removed
        if (updatingLineId) {
          setUpdatingLineId(null)
        }
        // Clear recipe swap state
        setIsRecipeSwapInProgress(false)
        // Refetch cart - this is the only refetch for recipe swaps
        getCartRefetch()
      },
      onError: () => {
        // Clear all updating states on error
        setUpdatingLineId(null)
        setIsRecipeSwapInProgress(false)
      },
    })

  const { mutate: addLine, isPending: isAddLineLoading } =
    useCartLinesAddMutation(client, {
      onSuccess: (data) => {
        // Check if the add was successful and this is a recipe swap
        if (data?.cartLinesAdd?.cart?.id && updatingLineId) {
          // Remove the old line after the new one is successfully added
          // Don't refetch here - wait until remove completes
          removeLine({
            cartId,
            lineIds: [updatingLineId],
          })
        } else {
          // Regular add (not a recipe swap) - refetch cart
          getCartRefetch()
        }
      },
      onError: () => {
        // Clear all updating states on error
        setUpdatingLineId(null)
        setIsRecipeSwapInProgress(false)
      },
    })

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const { cart } = data || {}
  const { edges } = cart?.lines || {}

  // Filter out lines with quantity 0 (Shopify sometimes returns these)
  const validEdges = edges?.filter(({ node }) => node.quantity > 0) || []

  // Use totalQuantity as the primary check, but also check validEdges as fallback
  const isEmpty = (cart?.totalQuantity ?? 0) === 0 || validEdges.length === 0
  const isDisabled =
    isGetCartLoading ||
    isRemoveLoading ||
    isUpdateLoading ||
    isAddLineLoading ||
    isRecipeSwapInProgress ||
    isCheckoutLoading

  const handleCheckoutClick = useCallback(() => {
    if (isCheckoutLoading) return

    if (!cart?.checkoutUrl) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Checkout URL is not available')
      }
      return
    }

    if (isEmpty) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cannot checkout with an empty cart')
      }
      return
    }

    const redirectToCheckout = (url: string) => {
      window.location.assign(url)
    }

    if (customerAccessToken && cartId) {
      updateCartIdentityForCheckout(
        {
          buyerIdentity: { customerAccessToken },
          cartId,
        },
        {
          onSuccess: (response) => {
            const buyerIdentityUpdate = response.cartBuyerIdentityUpdate
            const userErrors = buyerIdentityUpdate?.userErrors

            if (userErrors && userErrors.length > 0) {
              if (process.env.NODE_ENV === 'development') {
                console.error(
                  'Failed to update cart buyer identity before checkout',
                  userErrors
                )
              }
              redirectToCheckout(cart.checkoutUrl)
              return
            }

            const url =
              buyerIdentityUpdate?.cart?.checkoutUrl ?? cart.checkoutUrl
            if (url) redirectToCheckout(url)
          },
          onError: () => {
            redirectToCheckout(cart.checkoutUrl)
          },
        }
      )
    } else {
      redirectToCheckout(cart.checkoutUrl)
    }
  }, [
    cart,
    cartId,
    customerAccessToken,
    isCheckoutLoading,
    isEmpty,
    updateCartIdentityForCheckout,
  ])

  const handleDeleteClick = useCallback(
    (productId: string) => {
      removeLine({
        cartId,
        lineIds: [productId],
      })
    },
    [cartId, removeLine]
  )

  const handleDecreaseClick = useCallback(
    (productId: string) => {
      const line = edges && findProductLine(edges as CartLineEdge[], productId)

      if (line && line.node.quantity > 0) {
        updateLine({
          cartId,
          lines: [
            {
              id: line.node.id,
              quantity: line.node.quantity - 1,
            },
          ],
        })
      }
    },
    [cartId, edges, updateLine]
  )

  const handleIncreaseClick = useCallback(
    (productId: string) => {
      const line = edges?.find(({ node: { id } }) => id === productId)

      if (line && line.node.quantity > 0) {
        updateLine({
          cartId,
          lines: [
            {
              id: line.node.id,
              quantity: line.node.quantity + 1,
            },
          ],
        })
      }
    },
    [cartId, edges, updateLine]
  )

  const handleFrequencyChange = useCallback(
    (cartLineId: string, sellingPlanId: string) => {
      const line = edges?.find(({ node: { id } }) => id === cartLineId)

      if (!line) {
        return
      }

      if (!sellingPlanId) {
        if (process.env.NODE_ENV === 'development') {
          console.error('No selling plan ID provided for frequency change')
        }
        return
      }

      const recipeSlug =
        getRecipeSlugFromVariantId(
          line?.node.merchandise?.id,
          productConfigs
        ) ?? ''

      const daysInPeriod =
        productConfigs?.[
          recipeSlug as RecipeSlug
        ]?.sellingPlanOptions.find((p) => p.id === sellingPlanId)
          ?.daysInPeriod ?? null

      if (!daysInPeriod) {
        if (process.env.NODE_ENV === 'development') {
          console.error('No days in period found for frequency change')
        }
        toast(
          <Toast
            type={ToastTypes.error}
            title={t('updateProductError')}
            iconAlt={tToast('Error.iconAlt')}
          />
        )
        return
      }

      const packsPerDelivery = getPacksPerDelivery(
        formData,
        recipeSlug as RecipeSlug,
        mode === 'topper' ? 'topper' : 'full',
        daysInPeriod
      )

      setUpdatingLineId(cartLineId)
      updateLine(
        {
          cartId,
          lines: [
            {
              id: line.node.id,
              sellingPlanId,
              quantity: packsPerDelivery,
            },
          ],
        },
        {
          onError: () => {
            setFailedFrequencyLineId(cartLineId)
            setTimeout(() => setFailedFrequencyLineId(null), 2000)
          },
        }
      )
    },
    [cartId, edges, formData, mode, productConfigs, updateLine]
  )

  const handleRecipeChange = useCallback(
    (cartLineId: string, recipe: RecipeSlug) => {
      const line = edges?.find(({ node: { id } }) => id === cartLineId)

      if (!line) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Could not find cart line with id:', cartLineId)
        }
        return
      }

      const merchandise = line.node.merchandise
      if (!isProductVariant(merchandise)) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Merchandise is not a ProductVariant')
        }
        return
      }

      const sellingPlanAllocation = isSellingPlanAllocation(
        line.node.sellingPlanAllocation
      )
        ? line.node.sellingPlanAllocation
        : null
      const attributes = line.node.attributes || []

      // Check if this is a subscription
      const isSubscription = !!sellingPlanAllocation

      if (isSubscription) {
        // For subscriptions, we need to remove and re-add the line
        // because Shopify doesn't support changing merchandiseId for subscription lines

        // Extract attributes
        const portionAttribute = attributes.find(
          (attr) => attr.key === 'Portion'
        )
        const dogNameAttribute = attributes.find(
          (attr) => attr.key === 'Dog Name'
        )

        const portion =
          (portionAttribute?.value as 'FULL_MEAL' | 'TOPPER') || 'FULL_MEAL'
        const dogName = dogNameAttribute?.value as string | undefined

        // Generate new payload with the new recipe
        const currentPlanId = sellingPlanAllocation.sellingPlan.id

        const newRecipeConfig = productConfigs?.[recipe] ?? null

        const matchingPlan = newRecipeConfig?.sellingPlanOptions.find(
          (p) => p.id === currentPlanId
        )

        const newSellingPlanId =
          matchingPlan?.id ?? newRecipeConfig?.sellingPlanOptions[0]?.id ?? null

        const daysInPeriod =
          matchingPlan?.daysInPeriod ??
          newRecipeConfig?.sellingPlanOptions[0]?.daysInPeriod ??
          null

        if (!daysInPeriod) {
          if (process.env.NODE_ENV === 'development') {
            console.error('No days in period found for recipe change')
          }
          toast(
            <Toast
              type={ToastTypes.error}
              title={t('updateProductError')}
              iconAlt={tToast('Error.iconAlt')}
            />
          )
          return
        }

        const calculationMode = portion === 'TOPPER' ? 'topper' : 'full'
        const packsPerDelivery = getPacksPerDelivery(
          formData,
          recipe,
          calculationMode,
          daysInPeriod
        )

        const newPayload = generateCartPayload({
          recipeSlug: recipe,
          packsPerDelivery,
          portion,
          dogName,
          productConfig: newRecipeConfig,
          sellingPlanId: newSellingPlanId,
        })

        if (process.env.NODE_ENV === 'development') {
          console.log('Changing subscription recipe - adding new line first:', {
            cartLineId,
            recipe,
            packsPerDelivery,
            sellingPlanId: newSellingPlanId,
            portion,
            dogName,
            newPayload,
          })
        }

        // Mark this line as updating to show loading state
        setUpdatingLineId(cartLineId)
        // Mark that we're doing a recipe swap to prevent intermediate refetches
        setIsRecipeSwapInProgress(true)

        // Add the new line first (old line will be removed after success)
        addLine({
          cartId,
          lines: [newPayload],
        })
      } else {
        const newMerchandiseId =
          productConfigs?.[recipe]?.variantId ??
          PRODUCT_CONFIGS[recipe].variantId

        // Preserve attributes when changing merchandise
        const preservedAttributes = attributes
          .filter((attr) => attr.value != null)
          .map((attr) => ({
            key: attr.key,
            value: attr.value as string,
          }))

        const updatePayload: {
          id: string
          merchandiseId: string
          attributes?: Array<{ key: string; value: string }>
        } = {
          id: line.node.id,
          merchandiseId: newMerchandiseId,
          attributes: preservedAttributes,
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('Updating cart line with recipe change:', {
            cartLineId,
            recipe,
            newMerchandiseId,
            updatePayload,
          })
        }

        updateLine({
          cartId,
          lines: [updatePayload],
        })
      }
    },
    [cartId, edges, formData, productConfigs, t, tToast, updateLine, addLine]
  )

  if (!hasMounted) {
    return null
  }

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t('panelAriaLabel')}
      position="right"
    >
      <div className="flex flex-col h-full bg-neutral-50">
        <div className="flex flex-col px-6 pt-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between p-1">
            <p className="font-display leading-6 text-xl text-neutral-950">
              {t('title')}
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

          {isEmpty ? (
            <div className="flex flex-col items-center justify-center flex-1 py-12">
              <p className="font-sans font-normal leading-6 text-base text-neutral-950">
                {t('emptyState')}
              </p>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              {validEdges
                .filter(({ node: { merchandise } }) =>
                  isProductVariant(merchandise)
                )
                .map(
                  ({
                    node: {
                      id,
                      merchandise: productVariant,
                      quantity,
                      attributes,
                      sellingPlanAllocation,
                      cost,
                    },
                  }) => {
                    // Type guard ensures productVariant is ProductVariant
                    if (!isProductVariant(productVariant)) {
                      return null
                    }

                    const isUpdating = updatingLineId === id

                    const recipeSlug = getRecipeSlugFromTitle(
                      productVariant.product?.title
                    )

                    // If the product title doesn't match a known recipe, show
                    // no frequency options rather than options for the wrong recipe.
                    const planOptions = recipeSlug
                      ? planOptionsByRecipe[recipeSlug]
                      : []

                    return (
                      <ShoppingCartItem
                        key={id}
                        productVariant={productVariant}
                        quantity={quantity}
                        attributes={attributes}
                        sellingPlanAllocation={
                          isSellingPlanAllocation(sellingPlanAllocation)
                            ? sellingPlanAllocation
                            : null
                        }
                        cartLineId={id}
                        cost={cost}
                        onDeleteClick={() => handleDeleteClick(id)}
                        onDecreaseClick={() => handleDecreaseClick(id)}
                        onIncreaseClick={() => handleIncreaseClick(id)}
                        onFrequencyChange={(sellingPlanId) =>
                          handleFrequencyChange(id, sellingPlanId)
                        }
                        onRecipeChange={(recipe) =>
                          handleRecipeChange(id, recipe)
                        }
                        disabled={isDisabled || isUpdating}
                        failedFrequencyLineId={failedFrequencyLineId}
                        frequencyOptions={planOptions}
                        recipeOptions={recipeOptionsForCart}
                      />
                    )
                  }
                )}
            </div>
          )}
        </div>

        {!isEmpty && (
          <ShoppingCartFooter
            cart={cart}
            onCheckoutClick={handleCheckoutClick}
            onClose={onClose}
            disabled={isDisabled}
          />
        )}
      </div>
    </SidePanel>
  )
}

export { ShoppingCartPanel }
export type { ShoppingCartPanelProps }
