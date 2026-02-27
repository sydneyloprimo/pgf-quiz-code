import { ContentfulImage } from '@/components/common/ContentfulImage'

const FooterImage = () => {
  return (
    <div className="w-full lg:flex-1 relative min-h-80 lg:min-h-[500px] order-2 lg:order-0">
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
