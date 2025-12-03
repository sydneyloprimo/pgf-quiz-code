import { CurrencyCode } from '@/shopify/generated/graphql'

export const formatCurrency = (
  currencyCode: CurrencyCode = CurrencyCode.Usd,
  amount: number
) =>
  Intl.NumberFormat('en-IN', {
    currency: currencyCode,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: 'currency',
  }).format(amount)

export const getTranslatedOptions = (
  options: { labelKey: string; value: string }[],
  t: (key: string) => string
) =>
  options.map((option) => ({
    label: t(option.labelKey),
    value: option.value,
  }))
