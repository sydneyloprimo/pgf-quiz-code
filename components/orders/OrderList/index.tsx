'use client'
import EmptyState from 'components/orders/EmptyState'
import OrderCard from 'components/orders/OrderCard'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useCookies } from 'react-cookie'

import Loader from '@/components/cart/Loader'
import ListNextButton, {
  ListNextButtonTypes,
} from '@/components/common/ListNextButton'
import { client } from '@/shopify/client'
import { Order, useGetOrdersQuery } from '@/shopify/generated/graphql'
import { Cookies } from '@/types/enums/cookies'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

interface OrderListProps {
  className?: string
}

const PAGE_SIZE = 6

const OrderList = ({ className }: OrderListProps) => {
  const [cookies] = useCookies([Cookies.customerAccessToken])
  const searchParams = useSearchParams()
  const cursor = searchParams.get('cursor')
  const isBefore = searchParams.get('before')
  const [page, setPage] = useState(0)

  const cursorVariables = isBefore
    ? { before: cursor, last: PAGE_SIZE }
    : {
        after: cursor,
        first: PAGE_SIZE,
      }

  const { data, isLoading } = useGetOrdersQuery(client, {
    ...cursorVariables,
    customerAccessToken: cookies[Cookies.customerAccessToken],
  })

  const hasData = data && data.customer?.orders

  const {
    edges = [],
    pageInfo = {
      endCursor: null,
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
    },
  } = data?.customer?.orders || {}
  const isEmpty = edges.length === 0

  const onNextClick = () => {
    if (!hasData) return

    // Shallow redirection is not possible with next.js v13.4.5
    window.history.replaceState(
      null,
      '',
      `${Routes.orders}?cursor=${pageInfo.endCursor}`
    )
    setPage(page + 1)
  }

  const onPreviousClick = () => {
    if (!hasData) return

    const newCursor = pageInfo.startCursor
    setPage(page - 1)

    // Shallow redirection is not possible with next.js v13.4.5
    window.history.replaceState(
      null,
      '',
      `${Routes.orders}?cursor=${newCursor}&before=1`
    )
  }

  return (
    <div className="w-full">
      <h1 className="text-base mb-4 md:mb-0 md:text-xl">My Orders</h1>
      <div className="w-full">
        <div className={cn('w-full mt-7 flex flex-col', className)}>
          {isLoading && <Loader />}
          {!isLoading &&
            (isEmpty ? (
              <EmptyState className="b-[70px] md:my-40" />
            ) : (
              <>
                {edges.map(({ node }) => (
                  <OrderCard key={node.id} order={node as Order} />
                ))}
                <div className="flex justify-between">
                  <ListNextButton
                    type={ListNextButtonTypes.previous}
                    onClick={onPreviousClick}
                    disabled={!pageInfo.hasPreviousPage}
                  />
                  <ListNextButton
                    type={ListNextButtonTypes.next}
                    onClick={onNextClick}
                    disabled={!pageInfo.hasNextPage}
                  />
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  )
}

export default OrderList
