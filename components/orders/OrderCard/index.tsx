'use client'
import cn from 'classnames'

import { Order } from '@/shopify/generated/graphql'

interface OrderCardProps {
  className?: string
  order: Order
}

const OrderCard = ({ className, order }: OrderCardProps) => (
  <a
    href={order.statusUrl}
    target="_blank"
    className={cn(
      'p-[26px] md:p-5 md:mb-5 md:rounded-lg flex justify-between flex-1 border-b-dark-grey border-b border-solid border-t-transparent md:border border-x-transparent overflow-hidden md:border-dark-grey bg-white focus:border-dashed  focus:border-2 focus:border-focus focus:outline-none md:h-auto md:focus:border-none md:focus:outline-dashed md:focus:outline-2 md:focus:outline-focus',
      className
    )}
  >
    <div className="flex flex-col justify-between">
      <h3 className="text-sm text-start font-bold md:text-lg">{order.name}</h3>
    </div>
    <div className="flex flex-col justify-between">
      <h3 className="text-sm text-end font-bold md:font-regular md:text-lg">
        {`${order.totalPrice.currencyCode}${order.totalPrice.amount}`}
      </h3>
    </div>
  </a>
)

export default OrderCard
