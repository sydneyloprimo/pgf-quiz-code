import { QuizStep } from '@/types/enums/constants'
import { CtaLocation, CtaName, Events } from '@/types/enums/events'

type DataLayerParams = Record<string, unknown>

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

const isDev = process.env.NODE_ENV !== 'production'

export const trackEvent = (
  eventName: Events,
  params?: DataLayerParams
): void => {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ ...(params ?? {}), event: eventName })
  if (isDev) {
    console.log('[Analytics] trackEvent:', eventName, params)
  }
}

export const trackQuizStep = (
  stepName: QuizStep,
  stepIndex: number,
  quizData?: DataLayerParams
): void => {
  trackEvent(Events.quizStepAdvance, {
    step_name: stepName,
    step_index: stepIndex,
    ...quizData,
  })
}

export const trackCtaClick = (
  ctaName: CtaName,
  ctaLocation: CtaLocation,
  params?: DataLayerParams
): void => {
  trackEvent(Events.ctaClick, {
    cta_name: ctaName,
    cta_location: ctaLocation,
    ...params,
  })
}
