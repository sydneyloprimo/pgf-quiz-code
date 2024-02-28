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
