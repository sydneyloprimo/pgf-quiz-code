'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { cn } from '@/utils/cn'

interface ProductDetailImageGalleryProps {
  images: {
    main: string
    thumbnails: string[]
  }
  selectedImage: number
  onThumbnailClick: (index: number) => void
}

const ProductDetailImageGallery = ({
  images,
  selectedImage,
  onThumbnailClick,
}: ProductDetailImageGalleryProps) => {
  const t = useTranslations('Common.ProductDetailPanel')

  const allImages = [images.main, ...images.thumbnails]
  const currentImage = allImages[selectedImage] || images.main
  const thumbnails = images.thumbnails.slice(0, 3)

  const handleThumbnailClick = useCallback(
    (index: number) => {
      onThumbnailClick(index)
    },
    [onThumbnailClick]
  )

  const handleThumbnailButtonClick = useCallback(
    (thumbnailIndex: number) => {
      handleThumbnailClick(thumbnailIndex)
    },
    [handleThumbnailClick]
  )

  return (
    <div className="flex flex-col gap-5 items-start w-full">
      <div className="h-96 relative shrink-0 w-full">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src={currentImage}
            alt={t('mainImageAlt')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </div>
      </div>
      <div className="flex gap-3 items-start w-full">
        {thumbnails.map((thumbnail, index) => {
          const thumbnailIndex = index + 1
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleThumbnailButtonClick(thumbnailIndex)}
              className={cn(
                'flex-1 h-24 min-w-0 relative shrink-0',
                'cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-primary-600',
                selectedImage === thumbnailIndex && 'ring-2 ring-primary-600'
              )}
              aria-label={t('thumbnailAriaLabel', {
                number: thumbnailIndex,
              })}
            >
              <Image
                src={thumbnail}
                alt={t('thumbnailAlt', { number: thumbnailIndex })}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 33vw, 150px"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { ProductDetailImageGallery }
export type { ProductDetailImageGalleryProps }
