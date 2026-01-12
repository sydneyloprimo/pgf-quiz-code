'use client'

import { ProfileHeader } from '@/components/profile/ProfileHeader'

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col gap-6 md:gap-12 px-5 md:px-11 py-6 md:py-12">
      <ProfileHeader />
    </div>
  )
}
