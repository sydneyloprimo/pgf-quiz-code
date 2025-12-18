import Image from 'next/image'

import { cn } from '@/utils/cn'

const FooterImage = () => {
  return (
    <div
      className={cn(
        'w-full lg:flex-1',
        'relative',
        'min-h-80 lg:min-h-[500px]',
        'order-2 lg:order-0'
      )}
    >
      <Image
        src="/images/home/footer-dog.jpg"
        alt=""
        fill
        className="object-cover"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-tertiary-800-70 mix-blend-color"
        aria-hidden="true"
      />
    </div>
  )
}

export { FooterImage }
