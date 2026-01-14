'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Modal } from '@/components/common/Modal'

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
}

const OrderDetailsModal = ({
  isOpen,
  onClose,
  orderId,
}: OrderDetailsModalProps) => {
  const t = useTranslations('Profile.OrderDetailsModal')

  // Hardcoded order data - will be replaced with Shopify data later
  const orderData = {
    orderNumber: 'PG123456',
    date: '2024-07-26',
    total: '$123.45',
    status: 'Delivered',
    items: [
      {
        id: '1',
        image: '/images/product-full-meal.png',
        name: 'Purely Golden Foods - Adult Dog Food - Chicken & Rice',
        quantity: 1,
        price: '$45.00',
      },
      {
        id: '2',
        image: '/images/product-full-meal.png',
        name: 'Purely Golden Foods - Adult Dog Food - Chicken & Rice',
        quantity: 1,
        price: '$45.00',
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      line1: '123 Main St',
      line2: 'Anytown, CA 90210',
    },
    billingAddress: {
      name: 'John Doe',
      line1: '123 Main St',
      line2: 'Anytown, CA 90210',
    },
    paymentMethod: 'Visa ending in 1234',
    summary: {
      subtotal: '$90.00',
      shipping: '$5.00',
      tax: '$8.45',
      total: '$103.45',
    },
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeButtonLabel={t('closeButtonLabel')}
      ariaLabel={t('ariaLabel')}
      className="max-w-2xl p-8"
    >
      <div className="flex flex-col gap-8">
        {/* Order Header */}
        <div className="flex flex-col gap-4">
          <h2 className="heading-h5 font-sans text-xl text-secondary-950">
            {t('orderSummary')}
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-base text-secondary-950">
              <span>{t('orderNumber')}</span>
              <span className="font-semibold">{orderData.orderNumber}</span>
            </div>
            <div className="flex justify-between text-base text-secondary-950">
              <span>{t('date')}</span>
              <span className="font-semibold">{orderData.date}</span>
            </div>
            <div className="flex justify-between text-base text-secondary-950">
              <span>{t('status')}</span>
              <span className="font-semibold">{orderData.status}</span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="flex flex-col gap-4">
          <h3 className="heading-h5 font-sans text-xl text-secondary-950">
            {t('items')}
          </h3>
          <div className="flex flex-col gap-4">
            {orderData.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-start border-b border-neutral-500 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="relative w-20 h-20 shrink-0 bg-neutral-200 rounded-md overflow-hidden">
                  <Image
                    src={item.image}
                    alt={t('itemImageAlt', { name: item.name })}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <p className="text-base font-semibold text-secondary-950">
                    {item.name}
                  </p>
                  <div className="flex justify-between items-center text-sm text-secondary-950">
                    <span>
                      {t('quantity')}: {item.quantity}
                    </span>
                    <span className="text-base font-semibold">
                      {item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="flex flex-col gap-2">
          <h3 className="heading-h5 font-sans text-xl text-secondary-950">
            {t('shippingAddress')}
          </h3>
          <div className="flex flex-col gap-1 text-base text-secondary-950">
            <p>{orderData.shippingAddress.name}</p>
            <p>{orderData.shippingAddress.line1}</p>
            <p>{orderData.shippingAddress.line2}</p>
          </div>
        </div>

        {/* Billing Address */}
        <div className="flex flex-col gap-2">
          <h3 className="heading-h5 font-sans text-xl text-secondary-950">
            {t('billingAddress')}
          </h3>
          <div className="flex flex-col gap-1 text-base text-secondary-950">
            <p>{orderData.billingAddress.name}</p>
            <p>{orderData.billingAddress.line1}</p>
            <p>{orderData.billingAddress.line2}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-2">
          <h3 className="heading-h5 font-sans text-xl text-secondary-950">
            {t('paymentMethod')}
          </h3>
          <p className="text-base text-secondary-950">
            {orderData.paymentMethod}
          </p>
        </div>

        {/* Order Summary - Financial Breakdown */}
        <div className="flex flex-col gap-2 border-t border-neutral-500 pt-4">
          <h3 className="heading-h5 font-sans text-xl text-secondary-950">
            {t('orderSummary')}
          </h3>
          <div className="flex flex-col gap-2 text-base text-secondary-950">
            <div className="flex justify-between">
              <span>{t('subtotal')}</span>
              <span>{orderData.summary.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('shipping')}</span>
              <span>{orderData.summary.shipping}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('tax')}</span>
              <span>{orderData.summary.tax}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-neutral-500">
              <span>{t('total')}</span>
              <span>{orderData.summary.total}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export { OrderDetailsModal }
