import { client } from 'shopify/client'

import { useGetProductTypesQuery } from '@/shopify/generated/graphql'

const NUMBER_OF_CATEGORIES = 8

export const useProductTypes = () => {
  const { data } = useGetProductTypesQuery(client, {
    first: NUMBER_OF_CATEGORIES,
  })

  const categories = data?.productTypes?.edges?.map((edge) => ({
    name: edge?.node,
  }))

  return {
    categories,
  }
}
