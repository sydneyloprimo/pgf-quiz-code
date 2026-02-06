'use client'

import Image, { type ImageProps } from 'next/image'
import { useCallback, useMemo, useState } from 'react'

import { useContentfulImageResolve } from './ContentfulImageContext'

export type ContentfulImageProps = Omit<ImageProps, 'src'> & {
  src: string
}

const normalizedPath = (p: string) => (p.startsWith('/') ? p : `/${p}`)

/**
 * Renders an image using Contentful URL when available, otherwise the local path.
 * On Contentful URL load error, falls back to the local path (public/).
 */
function ContentfulImage({ src, alt, onError, ...rest }: ContentfulImageProps) {
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
  return <Image src={displaySrc} alt={alt} onError={handleError} {...rest} />
}

export {
  ContentfulImageProvider,
  useContentfulImageResolve,
} from './ContentfulImageContext'
export { ContentfulImage }
