import { PropsWithChildren } from 'react'

type ProductsLayoutProps = PropsWithChildren

export default function ProductsLayout({ children }: ProductsLayoutProps) {
  return <div className="min-h-screen min-w-full">{children}</div>
}
