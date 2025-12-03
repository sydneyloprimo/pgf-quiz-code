import type { BreedOption } from '@/components/quiz/QuizBreedSelection/BreedDropdown'

// Tailwind default md breakpoint is 768px
export const MOBILE_WIDTH = 768

export const MediaQuery = {
  desktop: `(min-width: ${MOBILE_WIDTH}px)`,
  mobile: `(max-width: ${MOBILE_WIDTH}px)`,
}

export const instagramUrl = 'https://www.instagram.com/rootstrap'

export const linkedinUrl = 'https://www.linkedin.com/company/rootstrap-it'

export const QUIZ_DOG_ILLUSTRATION_WIDTH = 268
export const QUIZ_DOG_ILLUSTRATION_HEIGHT = 266

export const QUIZ_DOG_ILLUSTRATION_SOURCE_WIDTH = 1536
export const QUIZ_DOG_ILLUSTRATION_SOURCE_HEIGHT = 1024

export const QUIZ_RESULTS_ILLUSTRATION_WIDTH = 167
export const QUIZ_RESULTS_ILLUSTRATION_HEIGHT = 103

// Quiz thresholds
export const PUPPY_MAX_AGE_YEARS = 1
export const MAX_DOG_WEIGHT_LBS = 25

// Quiz calculation constants
export const RER_BASE = 70

// Q3: Neutered status factors
export const NEUTERED_STATUS_FACTORS = {
  neutered: 1.6,
  intact: 1.8,
} as const

// Q10: Activity level factors
export const ACTIVITY_LEVEL_FACTORS = {
  'couch-potato': -0.1,
  'routine-walker': 0.0,
  'actively-athletic': 0.25,
} as const

// Q6: Body shape factors
export const BODY_SHAPE_FACTORS = {
  'light-lean': 1.1,
  'ideal-balanced': 1.0,
  'slightly-filled': 0.95,
  'full-round': 0.9,
} as const

// Recipe kcal/g values
export const RECIPE_KCAL_PER_GRAM = {
  turkey: 1.69,
  lamb: 1.47,
} as const

// Mode multipliers
export const MODE_MULTIPLIERS = {
  full: 1.0,
  topper: 0.25,
} as const

// Price per gram (placeholder values - should be fetched from product data)
export const PRICE_PER_GRAM = {
  turkey: 0.05,
  lamb: 0.06,
} as const

// Quiz body shapes
export const BODY_SHAPE_IMAGE_ASPECT_RATIO = '11/8' // Approximately 1.375 (close to actual 1.3731)

export interface BodyShapeOption {
  value: string
  image: string
  titleKey: string
  descriptionKey: string
  imageAltKey: string
}

export const BODY_SHAPE_OPTIONS: BodyShapeOption[] = [
  {
    value: 'light-lean',
    image: '/images/body-shape-light-lean.png',
    titleKey: 'options.lightLean.title',
    descriptionKey: 'options.lightLean.description',
    imageAltKey: 'options.lightLean.imageAlt',
  },
  {
    value: 'ideal-balanced',
    image: '/images/body-shape-ideal-balanced.png',
    titleKey: 'options.idealBalanced.title',
    descriptionKey: 'options.idealBalanced.description',
    imageAltKey: 'options.idealBalanced.imageAlt',
  },
  {
    value: 'slightly-filled',
    image: '/images/body-shape-slightly-filled.png',
    titleKey: 'options.slightlyFilled.title',
    descriptionKey: 'options.slightlyFilled.description',
    imageAltKey: 'options.slightlyFilled.imageAlt',
  },
  {
    value: 'full-round',
    image: '/images/body-shape-full-round.png',
    titleKey: 'options.fullRound.title',
    descriptionKey: 'options.fullRound.description',
    imageAltKey: 'options.fullRound.imageAlt',
  },
]

// Quiz activity levels
export interface ActivityLevelOption {
  labelKey: string
  value: string
}

export const ACTIVITY_LEVEL_OPTIONS: ActivityLevelOption[] = [
  { labelKey: 'options.couchPotato', value: 'couch-potato' },
  { labelKey: 'options.routineWalker', value: 'routine-walker' },
  { labelKey: 'options.activelyAthletic', value: 'actively-athletic' },
]

// Quiz breeds
export const BREEDS: BreedOption[] = [
  {
    labelKey: 'options.shihTzu',
    value: 'shih-tzu',
    categoryKey: 'categories.toyAndCompanion',
  },
  {
    labelKey: 'options.maltese',
    value: 'maltese',
    categoryKey: 'categories.toyAndCompanion',
  },
  {
    labelKey: 'options.yorkshireTerrier',
    value: 'yorkshire-terrier',
    categoryKey: 'categories.toyAndCompanion',
  },
  {
    labelKey: 'options.pomeranian',
    value: 'pomeranian',
    categoryKey: 'categories.toyAndCompanion',
  },
  {
    labelKey: 'options.papillon',
    value: 'papillon',
    categoryKey: 'categories.toyAndCompanion',
  },
  {
    labelKey: 'options.toyPoodle',
    value: 'toy-poodle',
    categoryKey: 'categories.toyAndCompanion',
  },
  {
    labelKey: 'options.chihuahua',
    value: 'chihuahua',
    categoryKey: 'categories.toyAndCompanion',
  },
  {
    labelKey: 'options.havanese',
    value: 'havanese',
    categoryKey: 'categories.toyAndCompanion',
  },
  {
    labelKey: 'options.japaneseChin',
    value: 'japanese-chin',
    categoryKey: 'categories.toyAndCompanion',
  },
  {
    labelKey: 'options.miniatureSchnauzer',
    value: 'miniature-schnauzer',
    categoryKey: 'categories.smallAndStylish',
  },
  {
    labelKey: 'options.cavalierKingCharlesSpaniel',
    value: 'cavalier-king-charles-spaniel',
    categoryKey: 'categories.smallAndStylish',
  },
  {
    labelKey: 'options.frenchBulldog',
    value: 'french-bulldog',
    categoryKey: 'categories.smallAndStylish',
  },
  {
    labelKey: 'options.bostonTerrier',
    value: 'boston-terrier',
    categoryKey: 'categories.smallAndStylish',
  },
  {
    labelKey: 'options.cotonDeTulear',
    value: 'coton-de-tulear',
    categoryKey: 'categories.smallAndStylish',
  },
  {
    labelKey: 'options.brusselsGriffon',
    value: 'brussels-griffon',
    categoryKey: 'categories.smallAndStylish',
  },
  {
    labelKey: 'options.bichonFrise',
    value: 'bichon-frise',
    categoryKey: 'categories.smallAndStylish',
  },
  {
    labelKey: 'options.lhasaApso',
    value: 'lhasa-apso',
    categoryKey: 'categories.smallAndStylish',
  },
  {
    labelKey: 'options.miniatureDachshund',
    value: 'miniature-dachshund',
    categoryKey: 'categories.sportingAndAdventurous',
  },
  {
    labelKey: 'options.cockerSpaniel',
    value: 'cocker-spaniel',
    categoryKey: 'categories.sportingAndAdventurous',
  },
  {
    labelKey: 'options.jackRussellTerrier',
    value: 'jack-russell-terrier',
    categoryKey: 'categories.sportingAndAdventurous',
  },
  {
    labelKey: 'options.westHighlandWhiteTerrier',
    value: 'west-highland-white-terrier',
    categoryKey: 'categories.sportingAndAdventurous',
  },
  {
    labelKey: 'options.miniaturePinscher',
    value: 'miniature-pinscher',
    categoryKey: 'categories.sportingAndAdventurous',
  },
  {
    labelKey: 'options.italianGreyhound',
    value: 'italian-greyhound',
    categoryKey: 'categories.sportingAndAdventurous',
  },
  {
    labelKey: 'options.scottishTerrier',
    value: 'scottish-terrier',
    categoryKey: 'categories.sportingAndAdventurous',
  },
]

// Quiz diet options
export interface DietOption {
  labelKey: string
  value: string
}

export const MAIN_FOOD_OPTIONS: DietOption[] = [
  { labelKey: 'options.dryFood', value: 'dry-food' },
  { labelKey: 'options.wetFood', value: 'wet-food' },
  { labelKey: 'options.rawFood', value: 'raw-food' },
  { labelKey: 'options.dehydratedFood', value: 'dehydrated-food' },
  { labelKey: 'options.freshFood', value: 'fresh-food' },
  { labelKey: 'options.homemadeFood', value: 'homemade-food' },
  { labelKey: 'options.mixedCombination', value: 'mixed-combination' },
]

export const TREAT_FREQUENCY_OPTIONS: DietOption[] = [
  { labelKey: 'options.no', value: 'no' },
  { labelKey: 'options.oneToTwoSmall', value: '1-2-small' },
  { labelKey: 'options.several', value: 'several' },
  { labelKey: 'options.lotsSpoiledRotten', value: 'lots-spoiled-rotten' },
]

export const MEALTIME_BEHAVIOR_OPTIONS: DietOption[] = [
  { labelKey: 'options.veryPicky', value: 'very-picky' },
  { labelKey: 'options.canBePicky', value: 'can-be-picky' },
  { labelKey: 'options.goodEater', value: 'good-eater' },
  { labelKey: 'options.willEatAnything', value: 'will-eat-anything' },
]
