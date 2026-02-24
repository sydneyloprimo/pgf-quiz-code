'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type ImageMap = Record<string, string>

function defaultResolve(path: string): string {
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('//')
  ) {
    return path.startsWith('//') ? `https:${path}` : path
  }
  return path.startsWith('/') ? path : `/${path}`
}

const ContentfulImageMapContext = createContext<{
  map: ImageMap | null
  resolve: (path: string) => string
}>({
  map: null,
  resolve: defaultResolve,
})

export function ContentfulImageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [map, setMap] = useState<ImageMap | null>(null)

  useEffect(() => {
    fetch('/api/contentful-image-map', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : {}))
      .then((m: ImageMap) => setMap(m))
      .catch(() => setMap({}))
  }, [])

  const resolve = useCallback(
    (path: string) => {
      if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('//')
      ) {
        return path.startsWith('//') ? `https:${path}` : path
      }
      const normalized = path.startsWith('/') ? path : `/${path}`
      if (map && normalized in map) {
        const url = map[normalized]
        return url.startsWith('//') ? `https:${url}` : url
      }
      return normalized
    },
    [map]
  )

  const value = useMemo(() => ({ map, resolve }), [map, resolve])

  return (
    <ContentfulImageMapContext.Provider value={value}>
      {children}
    </ContentfulImageMapContext.Provider>
  )
}

export function useContentfulImageResolve(): (path: string) => string {
  const { resolve } = useContext(ContentfulImageMapContext)
  return resolve
}
