import { PropsWithChildren } from 'react'

export default function CartLayout({ children }: PropsWithChildren) {
  return <div className="min-h-screen min-w-full">{children}</div>
}
