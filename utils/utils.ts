/* eslint-disable max-len */

export const formatCurrency = (currencyCode: string, amount: number) =>
  `${currencyCode} ${amount.toFixed(2)}`

export const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/
