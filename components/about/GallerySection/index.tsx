import { useTranslations } from 'next-intl'

import { ContentfulImage } from '@/components/common/ContentfulImage'
import { GALLERY_IMAGES } from '@/constants'

const GallerySection = () => {
  const t = useTranslations('About.Gallery')

  const images = GALLERY_IMAGES.map((item) => ({
    src: item.src,
    alt: t(item.altKey),
  }))

  return (
    <section className="w-full px-5 lg:px-24 py-0 my-14 flex justify-center">
      {/* Mobile/Tablet: Horizontal scrollable carousel with peek */}
      <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-6 w-full -mx-5 pl-5 pr-0">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-[80vw] aspect-[3/4] shrink-0 snap-start overflow-hidden"
          >
            <ContentfulImage
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover object-center"
              sizes="80vw"
            />
          </div>
        ))}
        {/* Spacer to show peek of last image */}
        <div className="shrink-0 w-5" aria-hidden="true" />
      </div>

      {/* Desktop: 3 images in a row */}
      <div className="hidden lg:flex flex-row gap-10 w-full">
        {images.map((image, index) => (
          <div key={index} className="relative flex-1 h-134 overflow-hidden">
            <ContentfulImage
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover object-center"
              sizes="388px"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export { GallerySection }
