'use client'

import { useQuery } from '@tanstack/react-query'

export function useFeatureFlag(key: string): boolean {
  const { data } = useQuery({
    queryKey: ['featureFlag', key],
    queryFn: async () => {
      const res = await fetch(
        `/api/feature-flags?key=${encodeURIComponent(key)}`
      )
      if (!res.ok) return { enabled: false }
      const json = await res.json()
      return { enabled: Boolean(json.enabled) }
    },
    staleTime: 60 * 1000,
  })

  return data?.enabled ?? false
}
