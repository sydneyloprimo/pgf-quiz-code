'use client'

import Image, { type ImageProps } from 'next/image'
import { useCallback, useMemo, useState } from 'react'

import { useContentfulImageResolve } from './ContentfulImageContext'

import { cn } from '@/utils/cn'

export type ContentfulImageProps = Omit<ImageProps, 'src'> & {
  src: string
  fillVariant?: 'native'
}

const normalizedPath = (p: string) => (p.startsWith('/') ? p : `/${p}`)

/**
 * Renders an image using Contentful URL when available, otherwise the local path.
 * On Contentful URL load error, falls back to the local path (public/).
 * Use fillVariant="native" for fill-style images without Next.js Image inline styles.
 */
function ContentfulImage({
  src,
  alt,
  onError,
  fillVariant,
  fill,
  priority,
  className,
  ...rest
}: ContentfulImageProps) {
  const resolve = useContentfulImageResolve()
  const resolvedSrc = useMemo(() => resolve(src), [resolve, src])
  const [useFallback, setUseFallback] = useState(false)
  const isContentfulUrl = normalizedPath(resolvedSrc) !== normalizedPath(src)

  const handleError = useCallback(
    (e: React.SyntheticEvent) => {
      if (isContentfulUrl) setUseFallback(true)
      onError?.(e as Parameters<NonNullable<ImageProps['onError']>>[0])
    },
    [isContentfulUrl, onError]
  )

  const displaySrc = useFallback && isContentfulUrl ? src : resolvedSrc

  if (fillVariant === 'native') {
    return (
      <div className="absolute inset-0">
        <img
          src={displaySrc}
          alt={alt}
          className={cn('size-full', className)}
          loading={priority ? 'eager' : 'lazy'}
          onError={handleError}
        />
      </div>
    )
  }

  return (
    <Image
      src={displaySrc}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
      onError={handleError}
      {...rest}
    />
  )
}

export {
  ContentfulImageProvider,
  useContentfulImageResolve,
} from './ContentfulImageContext'
export { ContentfulImage }
