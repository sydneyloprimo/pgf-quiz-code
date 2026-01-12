'use client'

import { useTranslations } from 'next-intl'

import { OrdersCard } from '@/components/profile/OrdersCard'
import { PetsCard } from '@/components/profile/PetsCard'
import { ProfileHeader } from '@/components/profile/ProfileHeader'

export default function ProfilePage() {
  const t = useTranslations('Profile')

  // TODO: Fetch actual pets and orders data
  const pets = [
    {
      name: 'Tommy',
      subscriptionStatus: 'active' as const,
      deliveryFrequency: 'Delivers Weekly',
      renewalDate: 'October 7 2025',
    },
    {
      name: 'Leia',
      subscriptionStatus: 'expired' as const,
      deliveryFrequency: 'Delivers Monthly',
      paymentStatus: 'Pending Payment',
    },
  ]

  const orders = [
    { id: '1', orderNumber: 'Order #123-456', hasIndicator: true },
    { id: '2', orderNumber: 'Order #123-456', hasIndicator: true },
    { id: '3', orderNumber: 'Order #123-456', hasIndicator: false },
    { id: '4', orderNumber: 'Order #123-456', hasIndicator: false },
    { id: '5', orderNumber: 'Order #123-456', hasIndicator: false },
  ]

  return (
    <div className="flex min-h-screen flex-col gap-6 md:gap-12 px-5 md:px-11 py-6 md:py-12">
      <ProfileHeader />
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8 flex-1">
        <div className="flex-1">
          <PetsCard pets={pets} />
        </div>
        <div className="flex-1">
          <OrdersCard orders={orders} />
        </div>
      </div>
    </div>
  )
}
