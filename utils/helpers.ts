export const formatCurrency = (currencyCode: string, amount: number) =>
  Intl.NumberFormat('en-IN', {
    currency: currencyCode,
    style: 'currency',
  }).format(amount)
