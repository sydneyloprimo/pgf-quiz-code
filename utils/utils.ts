/* eslint-disable max-len */
export const isPasswordValid = (value: string) => {
  const passwordRegex = new RegExp(
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})'
  )
  return passwordRegex.test(value)
}

export const isEmailValid = (value: string) => {
  if (value.length > 50) return false
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return emailRegex.test(value)
}

export const formatCurrency = (currencyCode: string, amount: number) =>
  `${currencyCode} ${amount.toFixed(2)}`
