'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/utils/cn'

// Animation frame images
const FRAME_IMAGES = [
  '/images/quiz-loading/frame-1.svg',
  '/images/quiz-loading/frame-2.svg',
  '/images/quiz-loading/frame-3.svg',
  '/images/quiz-loading/frame-4.svg',
]

const ANIMATION_DELAY_MS = 400
const FADE_DURATION_MS = 800
const TOTAL_CYCLE_MS = ANIMATION_DELAY_MS + FADE_DURATION_MS

interface FoodAnimationProps {
  className?: string
}

const FoodAnimation = ({ className }: FoodAnimationProps) => {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const [displayFrame, setDisplayFrame] = useState(0)

  // Preload all images on mount
  useEffect(() => {
    FRAME_IMAGES.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      window.setTimeout(() => {
        setCurrentFrame((prev) => (prev + 1) % FRAME_IMAGES.length)
        setIsFading(true)
        window.setTimeout(() => {
          setDisplayFrame((prev) => (prev + 1) % FRAME_IMAGES.length)
          setIsFading(false)
        }, FADE_DURATION_MS)
      }, ANIMATION_DELAY_MS)
    }, TOTAL_CYCLE_MS)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        'opacity-80',
        'size-[180px]',
        'relative',
        className
      )}
      aria-hidden="true"
    >
      <img
        src={FRAME_IMAGES[displayFrame]}
        alt=""
        className={cn(
          'absolute inset-0 block',
          'w-full h-full',
          'object-contain object-center',
          'will-change-opacity',
          'transition-opacity duration-800 ease-out',
          {
            'opacity-0': isFading,
            'opacity-100': !isFading,
          }
        )}
      />
      <img
        src={FRAME_IMAGES[currentFrame]}
        alt=""
        className={cn(
          'absolute inset-0 block',
          'w-full h-full',
          'object-contain object-center',
          'will-change-opacity',
          'transition-opacity duration-800 ease-out',
          {
            'opacity-100': isFading,
            'opacity-0': !isFading,
          }
        )}
      />
    </div>
  )
}

export { FoodAnimation }
