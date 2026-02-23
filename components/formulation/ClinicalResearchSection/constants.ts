export interface StepStaticData {
  imageSrc: string
  imageRotation: number
  imagePosition: {
    bottom: string
    left: string
  }
}

export const STEP_STATIC_DATA: StepStaticData[] = [
  {
    imageSrc: '/images/formulation/step-decorative-1.svg',
    imageRotation: 46.375,
    imagePosition: {
      bottom: '0',
      left: '-165.2px',
    },
  },
  {
    imageSrc: '/images/formulation/step-decorative-2.svg',
    imageRotation: 138.211,
    imagePosition: {
      bottom: '-52.36px',
      left: '-151.68px',
    },
  },
  {
    imageSrc: '/images/formulation/step-decorative-3.svg',
    imageRotation: 215.447,
    imagePosition: {
      bottom: '-34.27px',
      left: '-174.68px',
    },
  },
]

export const VALUE_PROP_COUNT = 3
