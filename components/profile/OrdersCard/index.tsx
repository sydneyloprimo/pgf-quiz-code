'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useId, useState } from 'react'

import { ChevronIcon } from '@/components/common/Icon'
import { OrderDetailsModal } from '@/components/profile/OrderDetailsModal'
import { OrderRow } from '@/components/profile/OrdersCard/OrderRow'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { useModal } from '@/hooks/useModal'
import {
  GetOrdersQuery,
  OrderFulfillmentStatus,
} from '@/shopify/generated/graphql'

type OrderEdge = NonNullable<
  GetOrdersQuery['customer']
>['orders']['edges'][number]
type OrderNode = OrderEdge['node']

interface OrdersCardProps {
  orders?: OrderEdge[]
}

const OrdersCard = ({ orders = [] }: OrdersCardProps) => {
  const t = useTranslations('Profile.OrdersCard')
  const [isOpen, setIsOpen] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderNode | null>(null)
  const contentId = useId()
  const { isOpen: isModalOpen, openModal, closeModal } = useModal()

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleDetailsClick = useCallback(
    (order: OrderNode) => {
      setSelectedOrder(order)
      openModal()
    },
    [openModal]
  )

  const getHasIndicator = (
    fulfillmentStatus: OrderFulfillmentStatus | null | undefined
  ): boolean => {
    return (
      fulfillmentStatus === OrderFulfillmentStatus.Unfulfilled ||
      fulfillmentStatus === OrderFulfillmentStatus.PartiallyFulfilled ||
      fulfillmentStatus === OrderFulfillmentStatus.InProgress
    )
  }

  return (
    <ProfileCard className="w-full bg-neutral-white border border-quaternary-800 p-6 flex flex-col gap-8">
      <button
        type="button"
        onClick={handleToggle}
        className="flex gap-3 items-start text-left"
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-label={t('title')}
      >
        <div className="flex flex-col gap-3 flex-1">
          <h2 className="heading-h5 text-secondary-950">{t('title')}</h2>
          <p className="text-body-m text-secondary-950">{t('description')}</p>
        </div>
        <ChevronIcon
          direction={isOpen ? 'up' : 'down'}
          className="size-6 text-secondary-950 shrink-0 cursor-pointer"
        />
      </button>
      {isOpen && (
        <div id={contentId} className="flex flex-col">
          {orders.length === 0 ? (
            <p className="text-body-m text-secondary-950">{t('emptyState')}</p>
          ) : (
            orders.map((orderEdge) => {
              const order = orderEdge.node
              const hasIndicator = getHasIndicator(order.fulfillmentStatus)
              const orderDisplayName = t('orderDisplayName', {
                name: order.name || `#${order.orderNumber}`,
              })

              return (
                <OrderRow
                  key={order.id}
                  order={order}
                  onDetailsClick={handleDetailsClick}
                  hasIndicator={hasIndicator}
                  orderDisplayName={orderDisplayName}
                  t={t}
                />
              )
            })
          )}
        </div>
      )}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          order={selectedOrder}
        />
      )}
    </ProfileCard>
  )
}

export { OrdersCard }
