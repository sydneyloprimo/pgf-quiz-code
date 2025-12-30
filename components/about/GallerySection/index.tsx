import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { GALLERY_IMAGES } from '@/constants'
import { cn } from '@/utils/cn'

const GallerySection = () => {
  const t = useTranslations('About.Gallery')

  const images = GALLERY_IMAGES.map((item) => ({
    src: item.src,
    alt: t(item.altKey),
  }))

  return (
    <section
      className={cn(
        'w-full',
        'px-5 md:px-24',
        'py-0',
        'my-14',
        'flex',
        'justify-center'
      )}
    >
      <div
        className={cn('flex', 'flex-row', 'gap-10', 'w-full', 'max-w-[78rem]')}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative flex-1 h-[33.5rem] overflow-hidden"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 388px"
            />
            <div
              className="absolute inset-0 bg-secondary-950 opacity-41 mix-blend-color"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export { GallerySection }
