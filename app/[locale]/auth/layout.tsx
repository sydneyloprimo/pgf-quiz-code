import { PropsWithChildren } from 'react'

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen w-full bg-auth_bg_image bg-no-repeat bg-cover flex justify-center md:block">
      {children}
    </div>
  )
}
