'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/common/Button'
import { InputDropdown } from '@/components/common/InputDropdown'
import { Modal } from '@/components/common/Modal'
import Spinner from '@/components/common/Spinner'
import { PRODUCT_CONFIGS } from '@/constants'
import {
  useProductConfigs,
  type ProductConfigsData,
} from '@/hooks/useProductConfigs'

type RecipeKey = 'turkey' | 'lamb' | 'pancreatic'

const DAYS_PER_WEEK = 7
const DAYS_PER_BIWEEK = 14

interface EditSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (payload: {
    shopifyVariantId: string
    orderIntervalFrequency: string
    orderIntervalUnit: string
  }) => void | Promise<{
    success: boolean
    error?: string
  }>
  petName: string
  currentVariantId: number
  currentProductTitle: string
  currentFrequency: number
  currentFrequencyUnit: string
}

const extractNumericId = (gid: string): string => {
  const match = gid.match(/\/(\d+)$/)
  return match ? match[1] : gid
}

const ALL_RECIPE_KEYS: RecipeKey[] = ['turkey', 'lamb', 'pancreatic']

const findCurrentRecipe = (
  currentVariantId: number,
  productTitle: string
): RecipeKey | null => {
  const currentIdStr = String(currentVariantId)

  for (const recipe of ALL_RECIPE_KEYS) {
    const config = PRODUCT_CONFIGS[recipe]
    const numericId = extractNumericId(config.variantId)
    if (numericId === currentIdStr) {
      return recipe
    }
  }

  const titleLower = productTitle.toLowerCase()
  for (const recipe of ALL_RECIPE_KEYS) {
    if (titleLower.includes(recipe)) {
      return recipe
    }
  }

  return null
}

const findCurrentFrequencyKey = (frequency: number, unit: string): string => {
  if (unit === 'day' && frequency === DAYS_PER_WEEK) {
    return 'weekly'
  }
  if (unit === 'day' && frequency === DAYS_PER_BIWEEK) {
    return 'biweekly'
  }
  if (unit === 'week' && frequency === 1) {
    return 'weekly'
  }
  if (unit === 'week' && frequency === 2) {
    return 'biweekly'
  }
  return 'weekly'
}

const getFrequencyOptionsForRecipe = (
  configs: ProductConfigsData,
  recipe: RecipeKey | null
): Array<{
  label: string
  value: string
  frequency: number
  unit: string
}> => {
  if (!recipe) return []

  const config = configs[recipe]
  if (!config) return []

  return config.sellingPlanOptions.map((plan) => ({
    label: plan.name,
    value: plan.daysInPeriod === DAYS_PER_WEEK ? 'weekly' : 'biweekly',
    frequency: plan.daysInPeriod / DAYS_PER_WEEK,
    unit: 'week',
  }))
}

const EditSubscriptionModal = ({
  isOpen,
  onClose,
  onConfirm,
  petName,
  currentVariantId,
  currentProductTitle,
  currentFrequency,
  currentFrequencyUnit,
}: EditSubscriptionModalProps) => {
  const t = useTranslations('Profile.EditSubscriptionModal')
  const {
    configs,
    availableRecipes,
    isLoading: isLoadingConfigs,
  } = useProductConfigs()

  const initialRecipe = findCurrentRecipe(currentVariantId, currentProductTitle)
  const initialFrequency = findCurrentFrequencyKey(
    currentFrequency,
    currentFrequencyUnit
  )

  const [selectedRecipe, setSelectedRecipe] = useState<RecipeKey | null>(
    initialRecipe
  )
  const [selectedFrequency, setSelectedFrequency] =
    useState<string>(initialFrequency)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const recipeOptions = useMemo(
    () =>
      availableRecipes.map((key) => ({
        label: t(`recipes.${key}`),
        value: key,
      })),
    [availableRecipes, t]
  )

  const frequencyData = useMemo(
    () => getFrequencyOptionsForRecipe(configs, selectedRecipe),
    [configs, selectedRecipe]
  )

  const frequencyOptions = useMemo(
    () =>
      frequencyData.map((freq) => ({
        label: t(`frequencies.${freq.value}`),
        value: freq.value,
      })),
    [frequencyData, t]
  )

  const hasChanges = useMemo(() => {
    const recipeChanged = selectedRecipe !== initialRecipe
    const frequencyChanged = selectedFrequency !== initialFrequency
    return recipeChanged || frequencyChanged
  }, [selectedRecipe, initialRecipe, selectedFrequency, initialFrequency])

  const handleConfirm = useCallback(async () => {
    if (!selectedRecipe) return

    const config = configs[selectedRecipe]
    if (!config) return

    setErrorMessage(null)
    setIsLoading(true)

    const numericVariantId = extractNumericId(config.variantId)

    const freq = frequencyData.find((f) => f.value === selectedFrequency)

    try {
      const result = await Promise.resolve(
        onConfirm({
          shopifyVariantId: numericVariantId,
          orderIntervalFrequency: String(freq?.frequency ?? 1),
          orderIntervalUnit: freq?.unit ?? 'week',
        })
      )
      const resolved =
        result && typeof result === 'object' && 'success' in result
          ? result.success
          : true

      if (resolved) {
        onClose()
      } else {
        const err = result && typeof result === 'object' ? result.error : null
        const knownCodes = new Set([
          'UNAUTHORIZED',
          'EDIT_FAILED',
          'SUBSCRIPTION_ID_REQUIRED',
          'INVALID_EDIT_PAYLOAD',
          'CUSTOMER_NOT_FOUND',
          'RECHARGE_CUSTOMER_NOT_FOUND',
          'SUBSCRIPTION_NOT_FOUND',
          'FORBIDDEN',
          'INTERNAL_SERVER_ERROR',
        ])
        const msg =
          err && typeof err === 'string' && knownCodes.has(err)
            ? t(`errors.${err}`)
            : t('errorMessage')
        setErrorMessage(msg)
      }
    } catch {
      setErrorMessage(t('errorMessage'))
    } finally {
      setIsLoading(false)
    }
  }, [
    selectedRecipe,
    selectedFrequency,
    frequencyData,
    configs,
    onConfirm,
    onClose,
    t,
  ])

  const handleClose = useCallback(() => {
    setErrorMessage(null)
    setSelectedRecipe(initialRecipe)
    setSelectedFrequency(initialFrequency)
    onClose()
  }, [onClose, initialRecipe, initialFrequency])

  const handleRecipeSelect = useCallback(
    (value: string) => {
      const newRecipe = value as RecipeKey
      setSelectedRecipe(newRecipe)
      setErrorMessage(null)

      const newFreqOptions = getFrequencyOptionsForRecipe(configs, newRecipe)
      const isCurrentFreqValid = newFreqOptions.some(
        (f) => f.value === selectedFrequency
      )
      if (!isCurrentFreqValid && newFreqOptions.length > 0) {
        setSelectedFrequency(newFreqOptions[0].value)
      }
    },
    [configs, selectedFrequency]
  )

  const handleFrequencySelect = useCallback((value: string) => {
    setSelectedFrequency(value)
    setErrorMessage(null)
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeButtonLabel={t('closeButtonLabel')}
      ariaLabel={t('ariaLabel', { petName })}
      className="max-w-lg p-8"
    >
      <div className="flex flex-col gap-6">
        <h2 className="heading-h5 font-sans text-xl text-secondary-950">
          {t('heading', { petName })}
        </h2>
        <p className="text-body-m text-secondary-950">{t('description')}</p>

        {isLoadingConfigs ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary-900">
                {t('recipeLabel')}
              </label>
              <InputDropdown
                value={selectedRecipe ?? undefined}
                placeholder={t('recipeLabel')}
                options={recipeOptions}
                onSelect={handleRecipeSelect}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary-900">
                {t('frequencyLabel')}
              </label>
              <InputDropdown
                value={selectedFrequency}
                placeholder={t('frequencyLabel')}
                options={frequencyOptions}
                onSelect={handleFrequencySelect}
              />
            </div>
          </>
        )}

        {errorMessage && (
          <p className="text-body-m text-feedback-error-500" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-4 pt-2">
          <Button
            variant="tertiary"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full md:w-auto md:flex-1"
          >
            {t('cancelButton')}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={
              isLoading || isLoadingConfigs || !selectedRecipe || !hasChanges
            }
            className="w-full md:w-auto md:flex-1"
          >
            {isLoading ? t('loading') : t('confirmButton')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export { EditSubscriptionModal }
