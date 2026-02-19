'use client'

import { useEffect, useState } from 'react'

import type { QuizBreedOption } from '@/contentful/quiz'

export function useQuizBreedOptions(locale: string): QuizBreedOption[] | null {
  const [options, setOptions] = useState<QuizBreedOption[] | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/quiz-breed-options?locale=${encodeURIComponent(locale)}`)
      .then((res) => res.json())
      .then((data: { options?: QuizBreedOption[] }) => {
        if (
          !cancelled &&
          Array.isArray(data?.options) &&
          data.options.length > 0
        ) {
          setOptions(data.options)
        } else {
          setOptions(null)
        }
      })
      .catch(() => setOptions(null))
    return () => {
      cancelled = true
    }
  }, [locale])

  return options
}
