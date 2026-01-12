import type { BreedOption } from '@/components/quiz/QuizBreedSelection/BreedDropdown'
import { Routes } from '@/types/enums/routes'

// Navigation links - centralized for MainNav and Footer
export interface NavLink {
  href: Routes
  labelKey: string
}

export const NAV_LINKS: NavLink[] = [
  { href: Routes.home, labelKey: 'home' },
  { href: Routes.formulation, labelKey: 'ourFormulation' },
  { href: Routes.about, labelKey: 'about' },
  { href: Routes.contact, labelKey: 'contact' },
]

// Tailwind default md breakpoint is 768px
export const MOBILE_WIDTH = 768

// Concierge contact information
export const CONCIERGE_EMAIL = 'concierge@purelygoldenfoods.com'
export const CONCIERGE_PHONE = '+1 111 111 1111'

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

// Products data
export interface Product {
  recipeName: string
  pricePerGram: number
  kcalPerGram: number
}

export const PRODUCTS: Record<'turkey' | 'lamb', Product> = {
  turkey: {
    recipeName: 'Turkey',
    pricePerGram: 0.05,
    kcalPerGram: 1.69,
  },
  lamb: {
    recipeName: 'Lamb',
    pricePerGram: 0.06,
    kcalPerGram: 1.47,
  },
} as const

// Mode multipliers
export const MODE_MULTIPLIERS = {
  full: 1.0,
  topper: 0.5,
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

// Quiz results product options
export interface QuizResultProduct {
  mode: 'topper' | 'fullMeal' | 'alaCarte'
  titleKey:
    | 'products.fullMeal.title'
    | 'products.topper.title'
    | 'products.alaCarte.title'
  descriptionKey:
    | 'products.fullMeal.description'
    | 'products.topper.description'
    | 'products.alaCarte.description'
  imageSrc: string
  isMostPopular: boolean
}

export const QUIZ_RESULT_PRODUCTS: QuizResultProduct[] = [
  {
    mode: 'fullMeal',
    titleKey: 'products.fullMeal.title',
    descriptionKey: 'products.fullMeal.description',
    imageSrc: '/images/product-full-meal.png',
    isMostPopular: true,
  },
  {
    mode: 'topper',
    titleKey: 'products.topper.title',
    descriptionKey: 'products.topper.description',
    imageSrc: '/images/product-topper.png',
    isMostPopular: false,
  },
]

// Quiz results footer benefits
export interface QuizResultBenefit {
  titleKey: string
  descriptionKey: string
}

export const QUIZ_RESULTS_FOOTER_BENEFITS: QuizResultBenefit[] = [
  {
    titleKey: 'benefits.improvedDigestion.title',
    descriptionKey: 'benefits.improvedDigestion.description',
  },
  {
    titleKey: 'benefits.allergyWeightControl.title',
    descriptionKey: 'benefits.allergyWeightControl.description',
  },
  {
    titleKey: 'benefits.moreMealtimesTogether.title',
    descriptionKey: 'benefits.moreMealtimesTogether.description',
  },
] as const

// How It Works section steps
export interface HowItWorksStep {
  stepNumber: number
  titleKey: string
  descriptionKey: string
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    stepNumber: 1,
    titleKey: 'step1Title',
    descriptionKey: 'step1Description',
  },
  {
    stepNumber: 2,
    titleKey: 'step2Title',
    descriptionKey: 'step2Description',
  },
  {
    stepNumber: 3,
    titleKey: 'step3Title',
    descriptionKey: 'step3Description',
  },
] as const

// Benefits section data
export interface BenefitData {
  titleKey: string
  descriptionKey: string
  pointerLabelKey?: string
  pointerPosition?: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  benefitIndex: number
}

export const BENEFITS_DATA: BenefitData[] = [
  {
    titleKey: 'benefit1Title',
    descriptionKey: 'benefit1Description',
    pointerLabelKey: 'pointerNutrition',
    pointerPosition: { top: '0', right: '30%' },
    benefitIndex: 0,
  },
  {
    titleKey: 'benefit2Title',
    descriptionKey: 'benefit2Description',
    pointerLabelKey: 'pointerEnergy',
    pointerPosition: { bottom: '10%', left: '0' },
    benefitIndex: 1,
  },
  {
    titleKey: 'benefit3Title',
    descriptionKey: 'benefit3Description',
    pointerLabelKey: 'pointerImmunity',
    pointerPosition: { top: '40%', left: '0' },
    benefitIndex: 2,
  },
  {
    titleKey: 'benefit4Title',
    descriptionKey: 'benefit4Description',
    pointerLabelKey: 'pointerCoat',
    pointerPosition: { top: '50%', right: '0' },
    benefitIndex: 3,
  },
  {
    titleKey: 'benefit5Title',
    descriptionKey: 'benefit5Description',
    pointerLabelKey: 'pointerDigestion',
    pointerPosition: { bottom: '5%', right: '25%' },
    benefitIndex: 4,
  },
] as const

// FAQ section data
export interface FAQData {
  questionKey: string
  answerKey: string
}

export const FAQS_DATA: FAQData[] = [
  {
    questionKey: 'faq1Question',
    answerKey: 'faq1Answer',
  },
  {
    questionKey: 'faq2Question',
    answerKey: 'faq2Answer',
  },
  {
    questionKey: 'faq3Question',
    answerKey: 'faq3Answer',
  },
  {
    questionKey: 'faq4Question',
    answerKey: 'faq4Answer',
  },
] as const

// Reviews section data
export interface ReviewData {
  image: string
  quoteKey: string
  reviewKey: string
  nameKey: string
}

export const REVIEWS_DATA: ReviewData[] = [
  {
    image: '/images/home/reviews-david.jpg',
    quoteKey: 'review1Quote',
    reviewKey: 'review1Text',
    nameKey: 'review1Name',
  },
  {
    image: '/images/home/reviews-mark.jpg',
    quoteKey: 'review2Quote',
    reviewKey: 'review2Text',
    nameKey: 'review2Name',
  },
  {
    image: '/images/home/reviews-david.jpg',
    quoteKey: 'review3Quote',
    reviewKey: 'review3Text',
    nameKey: 'review3Name',
  },
] as const

// Product detail panel images
export const PRODUCT_DETAIL_IMAGES = {
  main: '/images/product-detail-main.png',
  thumbnail2: '/images/product-detail-thumbnail-2.png',
  thumbnail3: '/images/product-detail-thumbnail-3.png',
} as const

// Side panel width (design-specific)
export const SIDE_PANEL_WIDTH = 500

// Product detail panel section IDs
export const PRODUCT_DETAIL_SECTION_IDS = {
  analyticalConstituents: 'analytical-constituents',
  nutritionalFacts: 'nutritional-facts',
  ingredients: 'ingredients',
} as const

// Product modes
export const PRODUCT_MODE = {
  topper: 'topper',
  fullMeal: 'fullMeal',
  alaCarte: 'alaCarte',
} as const

// Recipe types
export const RECIPE_TYPE = {
  turkey: 'turkey',
  lamb: 'lamb',
} as const

// Shipment frequencies
export const SHIPMENT_FREQUENCY = {
  everyWeek: 'everyWeek',
  everyTwoWeeks: 'everyTwoWeeks',
} as const

// Product detail panel default values
export const PRODUCT_DETAIL_DEFAULTS = {
  recipe: RECIPE_TYPE.turkey,
  quantity: 0,
  selectedImage: 0,
} as const

// Quiz results default values
export const QUIZ_RESULTS_DEFAULTS = {
  productMode: PRODUCT_MODE.fullMeal,
  recipe: RECIPE_TYPE.turkey,
  shipmentFrequency: SHIPMENT_FREQUENCY.everyWeek,
} as const

// Product detail panel section structure
export interface ProductDetailSectionConfig {
  id: string
  sectionKey: 'analyticalConstituents' | 'nutritionalFacts' | 'ingredients'
}

export const PRODUCT_DETAIL_SECTIONS_CONFIG: ProductDetailSectionConfig[] = [
  {
    id: PRODUCT_DETAIL_SECTION_IDS.analyticalConstituents,
    sectionKey: 'analyticalConstituents',
  },
  {
    id: PRODUCT_DETAIL_SECTION_IDS.nutritionalFacts,
    sectionKey: 'nutritionalFacts',
  },
  {
    id: PRODUCT_DETAIL_SECTION_IDS.ingredients,
    sectionKey: 'ingredients',
  },
] as const

// Ingredient library section data
export interface IngredientData {
  iconSrc: string
  nameKey: string
  descriptionKey: string
}

export const INGREDIENTS_DATA: IngredientData[] = [
  {
    iconSrc: '/icons/basil-icon.svg',
    nameKey: 'basil.name',
    descriptionKey: 'basil.description',
  },
  {
    iconSrc: '/icons/pumpkin-icon.svg',
    nameKey: 'pumpkin.name',
    descriptionKey: 'pumpkin.description',
  },
  {
    iconSrc: '/icons/basil-icon.svg',
    nameKey: 'turmeric.name',
    descriptionKey: 'turmeric.description',
  },
  {
    iconSrc: '/icons/pumpkin-icon.svg',
    nameKey: 'avocado.name',
    descriptionKey: 'avocado.description',
  },
  {
    iconSrc: '/icons/basil-icon.svg',
    nameKey: 'raspberry.name',
    descriptionKey: 'raspberry.description',
  },
  {
    iconSrc: '/icons/lamb-icon.svg',
    nameKey: 'lamb.name',
    descriptionKey: 'lamb.description',
  },
  {
    iconSrc: '/icons/pumpkin-icon.svg',
    nameKey: 'soybeans.name',
    descriptionKey: 'soybeans.description',
  },
] as const
