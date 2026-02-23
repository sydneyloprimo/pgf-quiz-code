'use client'

import { useEffect } from 'react'

/**
 * Hook that handles video autoplay functionality.
 * Sets up event listeners for video loading and error handling.
 *
 * @param videoRef - Ref to the video element
 */
export const useVideoAutoPlay = (
  videoRef: React.RefObject<HTMLVideoElement | null>
) => {
  useEffect(() => {
    const video = videoRef.current
    if (video && video instanceof HTMLVideoElement) {
      const handleCanPlay = () => {
        video.playbackRate = 0.85
        video.play().catch((error: unknown) => {
          console.error('Error playing video:', error)
        })
      }

      const handleError = () => {
        if (video.error) {
          console.error('Video error code:', video.error.code)
          console.error('Video error message:', video.error.message)
        }
      }

      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)

      // Try to load the video
      video.load()

      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
      }
    }
  }, [videoRef])
}
