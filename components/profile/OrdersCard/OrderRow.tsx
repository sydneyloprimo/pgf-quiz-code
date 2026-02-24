'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Button } from '@/components/common/Button'
import { GetOrdersQuery } from '@/shopify/generated/graphql'

type OrderEdge = NonNullable<
  GetOrdersQuery['customer']
>['orders']['edges'][number]
type OrderNode = OrderEdge['node']

interface OrderRowProps {
  order: OrderNode
  onDetailsClick: (order: OrderNode) => void
  hasIndicator: boolean
  orderDisplayName: string
  t: ReturnType<typeof useTranslations<'Profile.OrdersCard'>>
}

const OrderRow = ({
  order,
  onDetailsClick,
  hasIndicator,
  orderDisplayName,
  t,
}: OrderRowProps) => {
  const handleDetailsClick = useCallback(() => {
    onDetailsClick(order)
  }, [order, onDetailsClick])

  return (
    <div className="flex gap-3 items-center justify-between p-3 border-b border-neutral-500 last:border-b-0">
      <div className="flex gap-3 items-center flex-1">
        {hasIndicator && (
          <div className="size-2 rounded-full bg-primary-600 shrink-0" />
        )}
        <p className="text-base font-semibold text-secondary-950">
          {orderDisplayName}
        </p>
      </div>
      <Button variant="tertiary" size="small" onClick={handleDetailsClick}>
        {t('details')}
      </Button>
    </div>
  )
}

export { OrderRow }
