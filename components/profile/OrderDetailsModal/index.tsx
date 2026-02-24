'use client'

import { useTranslations } from 'next-intl'

import { Modal } from '@/components/common/Modal'
import {
  GetOrdersQuery,
  OrderFulfillmentStatus,
} from '@/shopify/generated/graphql'
import { formatCurrency } from '@/utils/helpers'

type OrderNode = NonNullable<
  GetOrdersQuery['customer']
>['orders']['edges'][number]['node']

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: OrderNode
}

const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) => {
  const t = useTranslations('Profile.OrderDetailsModal')

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusLabel = (
    fulfillmentStatus: OrderFulfillmentStatus | null | undefined
  ): string => {
    switch (fulfillmentStatus) {
      case OrderFulfillmentStatus.Fulfilled:
        return t('statusFulfilled', { defaultValue: 'Fulfilled' })
      case OrderFulfillmentStatus.PartiallyFulfilled:
        return t('statusPartiallyFulfilled', {
          defaultValue: 'Partially Fulfilled',
        })
      case OrderFulfillmentStatus.Unfulfilled:
        return t('statusUnfulfilled', { defaultValue: 'Unfulfilled' })
      case OrderFulfillmentStatus.InProgress:
        return t('statusInProgress', { defaultValue: 'In Progress' })
      default:
        return t('statusUnknown', { defaultValue: 'Unknown' })
    }
  }

  const orderDisplayName = t('orderDisplayName', {
    name: order.name || `#${order.orderNumber}`,
  })
  const lineItems = order.lineItems?.edges || []
  const shippingAddress = order.shippingAddress

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeButtonLabel={t('closeButtonLabel')}
      ariaLabel={t('ariaLabel')}
      className="max-w-2xl p-6 md:p-8"
    >
      <div className="flex flex-col gap-6">
        {/* Order Header */}
        <div className="flex flex-col gap-3">
          <h2 className="heading-h5 text-secondary-950">{t('orderSummary')}</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-body-m text-secondary-950">
              <span>{t('orderNumber')}</span>
              <span className="font-semibold">{orderDisplayName}</span>
            </div>
            <div className="flex justify-between text-body-m text-secondary-950">
              <span>{t('date')}</span>
              <span className="font-semibold">
                {formatDate(order.processedAt)}
              </span>
            </div>
            <div className="flex justify-between text-body-m text-secondary-950">
              <span>{t('status')}</span>
              <span className="font-semibold">
                {getStatusLabel(order.fulfillmentStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* Items */}
        {lineItems.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="heading-h5 text-secondary-950">{t('items')}</h3>
            <div className="flex flex-col gap-3">
              {lineItems.map((lineItemEdge) => {
                const lineItem = lineItemEdge.node
                const price = formatCurrency(
                  lineItem.discountedTotalPrice.currencyCode,
                  parseFloat(lineItem.discountedTotalPrice.amount)
                )

                return (
                  <div
                    key={lineItem.title}
                    className="flex justify-between items-start gap-4 border-b border-neutral-500 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-body-m font-semibold text-secondary-950">
                        {lineItem.title}
                      </p>
                      <p className="text-body-s text-neutral-700">
                        {t('quantity')}: {lineItem.quantity}
                      </p>
                    </div>
                    <span className="text-body-m font-semibold text-secondary-950 shrink-0">
                      {price}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {shippingAddress && (
          <div className="flex flex-col gap-3">
            <h3 className="heading-h5 text-secondary-950">
              {t('shippingAddress')}
            </h3>
            <div className="flex flex-col gap-1 text-body-m text-secondary-950">
              {shippingAddress.name && <p>{shippingAddress.name}</p>}
              {shippingAddress.address1 && <p>{shippingAddress.address1}</p>}
              {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
              {shippingAddress.formattedArea && (
                <p>{shippingAddress.formattedArea}</p>
              )}
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="flex flex-col gap-3">
          <h3 className="heading-h5 text-secondary-950">
            {t('paymentMethod')}
          </h3>
          <p className="text-body-m text-secondary-950">
            {t('paymentCompleted')}
          </p>
        </div>

        {/* Order Summary - Financial Breakdown */}
        <div className="flex flex-col gap-3 border-t border-neutral-500 pt-4">
          <h3 className="heading-h5 text-secondary-950">{t('orderSummary')}</h3>
          <div className="flex flex-col gap-2 text-body-m text-secondary-950">
            {order.subtotalPrice && (
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span>
                  {formatCurrency(
                    order.subtotalPrice.currencyCode,
                    parseFloat(order.subtotalPrice.amount)
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{t('shipping')}</span>
              <span>
                {formatCurrency(
                  order.totalShippingPrice.currencyCode,
                  parseFloat(order.totalShippingPrice.amount)
                )}
              </span>
            </div>
            {order.totalTax && (
              <div className="flex justify-between">
                <span>{t('tax')}</span>
                <span>
                  {formatCurrency(
                    order.totalTax.currencyCode,
                    parseFloat(order.totalTax.amount)
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold text-body-l pt-2 border-t border-neutral-500">
              <span>{t('total')}</span>
              <span>
                {formatCurrency(
                  order.currentTotalPrice.currencyCode,
                  parseFloat(order.currentTotalPrice.amount)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export { OrderDetailsModal }
