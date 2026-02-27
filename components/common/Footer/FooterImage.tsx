import { ContentfulImage } from '@/components/common/ContentfulImage'
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
      <ContentfulImage
        src="/images/home/footer-dog.png"
        alt=""
        fill
        className="object-cover"
        aria-hidden="true"
      />
    </div>
  )
}

export { FooterImage }
