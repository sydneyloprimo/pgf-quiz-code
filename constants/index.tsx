import type { BreedOption } from '@/components/quiz/QuizBreedSelection/BreedDropdown'
import { Routes } from '@/types/enums/routes'

export const SITE_URL = 'https://www.purelygoldenfoods.com'

export const MAIN_CONTENT_ID = 'main-content'

// Navigation links - centralized for MainNav and Footer
export interface NavLink {
  href: Routes
  labelKey: string
}

export const NAV_LINKS: NavLink[] = [
  { href: Routes.home, labelKey: 'home' },
  { href: Routes.formulation, labelKey: 'ourFormulation' },
  { href: Routes.about, labelKey: 'about' },
]

// 404 Not Found page
export const NOT_FOUND_DOG_BOWL_IMAGE = '/images/404-dog-bowl.svg'

// Blog index
export const BLOG_FEATURED_IMAGE_PATH = '/images/blog-featured.jpg'
export const BLOG_INDEX_POSTS_PER_PAGE = 4

// Tailwind default md breakpoint is 768px
export const MOBILE_WIDTH = 768

// Formulation page section spacing: base 64px top/bottom (py-16), lg 144px top/bottom (py-36)
export const FORMULATION_SECTION_PADDING_Y = 'py-16 lg:py-36'
export const FORMULATION_SECTION_PADDING_X = 'px-5 lg:px-24'

// Concierge contact information
export const CONCIERGE_EMAIL = 'concierge@purelygoldenfoods.com'
export const CONCIERGE_PHONE = '+1 111 111 1111'

export const MediaQuery = {
  desktop: `(min-width: ${MOBILE_WIDTH}px)`,
  mobile: `(max-width: ${MOBILE_WIDTH}px)`,
}

export const RECHARGE_API_URL = 'https://api.rechargeapps.com'

export const instagramUrl = 'https://www.instagram.com/rootstrap'

export const linkedinUrl = 'https://www.linkedin.com/company/rootstrap-it'

export const QUIZ_RESULTS_ILLUSTRATION_WIDTH = 167
export const QUIZ_RESULTS_ILLUSTRATION_HEIGHT = 103

// Quiz thresholds
export const PUPPY_MAX_AGE_YEARS = 1
export const MAX_DOG_WEIGHT_LBS = 20

// Boston-area ZIP codes for quiz location step (founding cohort enrollment)
export const BOSTON_AREA_ZIP_CODES: ReadonlySet<string> = new Set([
  '02108',
  '02109',
  '02110',
  '02111',
  '02112',
  '02113',
  '02114',
  '02115',
  '02116',
  '02117',
  '02118',
  '02119',
  '02120',
  '02121',
  '02122',
  '02123',
  '02124',
  '02125',
  '02126',
  '02127',
  '02128',
  '02129',
  '02130',
  '02131',
  '02132',
  '02133',
  '02134',
  '02135',
  '02136',
  '02163',
  '02196',
  '02199',
  '02201',
  '02203',
  '02204',
  '02205',
  '02206',
  '02210',
  '02211',
  '02212',
  '02215',
  '02217',
  '02222',
  '02241',
  '02266',
  '02283',
  '02284',
  '02293',
  '02295',
  '02297',
  '02298',
])

export const MIN_ZIP_CODE_LENGTH = 5
export const QUIZ_LOADING_DURATION_MS = 5000
export const FEATURE_FLAG_LAMB = 'LambEnabled'
export const FEATURE_FLAG_PANCREATIC = 'PancreaticEnabled'
export const FEATURE_FLAG_REVIEWS = 'ReviewsEnabled'
export const FEATURE_FLAG_WAITLIST = 'waitlistFlip'
export const QUIZ_ENROLLMENT_TAGS = ['quiz-enrollment', 'beta-cohort'] as const
export const QUIZ_RESULTS_NOTE_LABEL = 'Results link'

// Cart line attribute for subscription packs clarification (shown on Shopify checkout)
export const PACKS_CLARIFICATION_ATTRIBUTE_KEY = 'Packs note'
export const PACKS_CLARIFICATION_MESSAGE_FORMAT =
  '{packs} packs per delivery (not multiple subscriptions)'
export const QUIZ_PACK_CALCULATION_DEFAULTS = {
  recipe: 'turkey' as const,
  mode: 'full' as const,
}
export const QUIZ_RESULTS_PARAM_KEYS = [
  'name',
  'gender',
  'age',
  'weight',
  'zipCode',
  'neuteredStatus',
  'breed',
  'bodyShape',
  'mainFood',
  'treatFrequency',
  'mealtimeBehavior',
  'activityLevel',
  'subscriptionType',
] as const

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
    image: '/images/body-shape-light-lean.svg',
    titleKey: 'options.lightLean.title',
    descriptionKey: 'options.lightLean.description',
    imageAltKey: 'options.lightLean.imageAlt',
  },
  {
    value: 'ideal-balanced',
    image: '/images/body-shape-ideal-balanced.svg',
    titleKey: 'options.idealBalanced.title',
    descriptionKey: 'options.idealBalanced.description',
    imageAltKey: 'options.idealBalanced.imageAlt',
  },
  {
    value: 'slightly-filled',
    image: '/images/body-shape-slightly-filled.svg',
    titleKey: 'options.slightlyFilled.title',
    descriptionKey: 'options.slightlyFilled.description',
    imageAltKey: 'options.slightlyFilled.imageAlt',
  },
  {
    value: 'full-round',
    image: '/images/body-shape-full-round.svg',
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

export interface SubscriptionTypeOption {
  labelKey: string
  value: string
}

export const SUBSCRIPTION_TYPE_OPTIONS: SubscriptionTypeOption[] = [
  {
    labelKey: 'options.completeProtocol',
    value: 'complete-protocol',
  },
  {
    labelKey: 'options.topperProtocol',
    value: 'topper-protocol',
  },
  {
    labelKey: 'options.singleMeals',
    value: 'single-meals',
  },
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
export interface PointerPosition {
  mobile?: { top?: string; right?: string; left?: string; bottom?: string }
  md?: { top?: string; right?: string; left?: string; bottom?: string }
  lg?: { top?: string; right?: string; left?: string; bottom?: string }
}

export interface BenefitData {
  titleKey: string
  descriptionKey: string
  pointerLabelKey?: string
  pointerPosition: PointerPosition
  labelSide: 'left' | 'right'
  benefitIndex: number
}

export const BENEFITS_DATA: BenefitData[] = [
  {
    titleKey: 'benefit1Title',
    descriptionKey: 'benefit1Description',
    pointerLabelKey: 'pointerSkin',
    pointerPosition: {
      mobile: { top: '38%', right: '16%' },
      md: { top: '38%', right: '30%' },
      lg: { top: '44%', right: '50%' },
    },
    labelSide: 'left',
    benefitIndex: 0,
  },
  {
    titleKey: 'benefit2Title',
    descriptionKey: 'benefit2Description',
    pointerLabelKey: 'pointerQuality',
    pointerPosition: {
      mobile: { bottom: '11%', right: '56%' },
      md: { bottom: '15%', right: '68%' },
      lg: { bottom: '15%', right: '66%' },
    },
    labelSide: 'left',
    benefitIndex: 1,
  },
  {
    titleKey: 'benefit3Title',
    descriptionKey: 'benefit3Description',
    pointerLabelKey: 'pointerMicrobiome',
    pointerPosition: {
      mobile: { top: '68%', right: '39%' },
      md: { top: '70%', right: '53%' },
      lg: { top: '70%', left: '6%' },
    },
    labelSide: 'left',
    benefitIndex: 2,
  },
  {
    titleKey: 'benefit4Title',
    descriptionKey: 'benefit4Description',
    pointerLabelKey: 'pointerEnergy',
    pointerPosition: {
      mobile: { top: '48%', left: '50%' },
      md: { top: '48%', left: '61%' },
      lg: { top: '48%', left: '65%' },
    },
    labelSide: 'right',
    benefitIndex: 3,
  },
  {
    titleKey: 'benefit5Title',
    descriptionKey: 'benefit5Description',
    pointerLabelKey: 'pointerDigestive',
    pointerPosition: {
      mobile: { top: '59%', left: '46%' },
      md: { top: '64%', right: '18%' },
      lg: { bottom: '30%', left: '60%' },
    },
    labelSide: 'right',
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
  {
    questionKey: 'faq5Question',
    answerKey: 'faq5Answer',
  },
  {
    questionKey: 'faq6Question',
    answerKey: 'faq6Answer',
  },
] as const

// Boston announcement section data
export const BOSTON_ANNOUNCEMENT_BACKGROUND_IMAGE =
  '/images/home/boston-announcement-bg.jpg'

// About page - Gallery section
export interface GalleryImage {
  src: string
  altKey: string
}

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: '/images/about/gallery/image1.jpg',
    altKey: 'image1Alt',
  },
  {
    src: '/images/about/gallery/image2.jpg',
    altKey: 'image2Alt',
  },
  {
    src: '/images/about/gallery/image3.jpg',
    altKey: 'image3Alt',
  },
] as const

// About page - Commitment section

export interface CommitmentItem {
  textKey: string
}

export const COMMITMENT_ITEMS: CommitmentItem[] = [
  {
    textKey: 'card1',
  },
  {
    textKey: 'card2',
  },
  {
    textKey: 'card3',
  },
] as const

// About page - Experts section
export interface ExpertItem {
  id: string
  imageSrc: string
  imageAltKey: string
  nameKey: string
  descriptionKey: string
}

export const EXPERT_ITEMS: ExpertItem[] = [
  {
    id: 'expert-1',
    imageSrc: '/images/about/expert-1.png',
    imageAltKey: 'expert1ImageAlt',
    nameKey: 'expert1Name',
    descriptionKey: 'expert1Description',
  },
  {
    id: 'expert-2',
    imageSrc: '/images/about/expert-2.png',
    imageAltKey: 'expert2ImageAlt',
    nameKey: 'expert2Name',
    descriptionKey: 'expert2Description',
  },
  {
    id: 'expert-3',
    imageSrc: '/images/about/expert-3.jpg',
    imageAltKey: 'expert3ImageAlt',
    nameKey: 'expert3Name',
    descriptionKey: 'expert3Description',
  },
] as const

// About page - Values section
export type ValueIconType = 'featurePharm' | 'graduationCap' | 'pawPrint'

export interface ValueItem {
  titleKey: string
  descriptionKey: string
}

export const VALUE_ITEMS: ValueItem[] = [
  {
    titleKey: 'card1Title',
    descriptionKey: 'card1Description',
  },
  {
    titleKey: 'card2Title',
    descriptionKey: 'card2Description',
  },
  {
    titleKey: 'card3Title',
    descriptionKey: 'card3Description',
  },
] as const

// Product detail panel images
export const PRODUCT_DETAIL_IMAGES = {
  main: '/images/product-detail-main.png',
  thumbnail2: '/images/product-detail-thumbnail-2.png',
  thumbnail3: '/images/product-detail-thumbnail-3.png',
} as const

// Pack size constant (8oz in grams)
export const PACK_SIZE_GRAMS = 226.796 // 8 * 28.3495

// Product configuration for cart operations
export interface ProductConfig {
  variantId: string
  sellingPlanIds: {
    weekly: string | null
    biweekly: string | null
  }
}

export const PRODUCT_CONFIGS: Record<
  'turkey' | 'lamb' | 'pancreatic',
  ProductConfig
> = {
  turkey: {
    variantId: 'gid://shopify/ProductVariant/47241921626333',
    sellingPlanIds: {
      weekly: 'gid://shopify/SellingPlan/6280184029',
      biweekly: 'gid://shopify/SellingPlan/6280216797',
    },
  },
  lamb: {
    variantId: 'gid://shopify/ProductVariant/47241925918941',
    sellingPlanIds: {
      weekly: 'gid://shopify/SellingPlan/6280052957',
      biweekly: 'gid://shopify/SellingPlan/6280085725',
    },
  },
  pancreatic: {
    variantId: 'gid://shopify/ProductVariant/47241926344925',
    sellingPlanIds: {
      weekly: 'gid://shopify/SellingPlan/6280151261',
      biweekly: 'gid://shopify/SellingPlan/6280118493',
    },
  },
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
  seafood: 'seafood',
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

// Formulation section data

export interface FAQItem {
  questionKey: string
  answerKey: string
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    questionKey: 'formulationFaq1Question',
    answerKey: 'formulationFaq1Answer',
  },
  {
    questionKey: 'formulationFaq2Question',
    answerKey: 'formulationFaq2Answer',
  },
  {
    questionKey: 'formulationFaq3Question',
    answerKey: 'formulationFaq3Answer',
  },
  {
    questionKey: 'formulationFaq4Question',
    answerKey: 'formulationFaq4Answer',
  },
  {
    questionKey: 'formulationFaq5Question',
    answerKey: 'formulationFaq5Answer',
  },
  {
    questionKey: 'formulationFaq6Question',
    answerKey: 'formulationFaq6Answer',
  },
  {
    questionKey: 'formulationFaq7Question',
    answerKey: 'formulationFaq7Answer',
  },
  {
    questionKey: 'formulationFaq8Question',
    answerKey: 'formulationFaq8Answer',
  },
  {
    questionKey: 'formulationFaq9Question',
    answerKey: 'formulationFaq9Answer',
  },
]

// Ingredient library section data
export interface IngredientData {
  nameKey: string
  descriptionKey: string
}

export interface IngredientCategory {
  titleKey: string
  items: IngredientData[]
}

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  {
    titleKey: 'categories.proteinsOrgans.title',
    items: [
      {
        nameKey: 'categories.proteinsOrgans.items.turkey.name',
        descriptionKey: 'categories.proteinsOrgans.items.turkey.description',
      },
      {
        nameKey: 'categories.proteinsOrgans.items.lamb.name',
        descriptionKey: 'categories.proteinsOrgans.items.lamb.description',
      },
      {
        nameKey: 'categories.proteinsOrgans.items.cod.name',
        descriptionKey: 'categories.proteinsOrgans.items.cod.description',
      },
      {
        nameKey: 'categories.proteinsOrgans.items.beefLiver.name',
        descriptionKey: 'categories.proteinsOrgans.items.beefLiver.description',
      },
      {
        nameKey: 'categories.proteinsOrgans.items.chickenLiver.name',
        descriptionKey:
          'categories.proteinsOrgans.items.chickenLiver.description',
      },
      {
        nameKey: 'categories.proteinsOrgans.items.egg.name',
        descriptionKey: 'categories.proteinsOrgans.items.egg.description',
      },
    ],
  },
  {
    titleKey: 'categories.carbohydratesFiber.title',
    items: [
      {
        nameKey: 'categories.carbohydratesFiber.items.pumpkin.name',
        descriptionKey:
          'categories.carbohydratesFiber.items.pumpkin.description',
      },
      {
        nameKey: 'categories.carbohydratesFiber.items.sweetPotato.name',
        descriptionKey:
          'categories.carbohydratesFiber.items.sweetPotato.description',
      },
      {
        nameKey: 'categories.carbohydratesFiber.items.brownRice.name',
        descriptionKey:
          'categories.carbohydratesFiber.items.brownRice.description',
      },
      {
        nameKey: 'categories.carbohydratesFiber.items.butternutSquash.name',
        descriptionKey:
          'categories.carbohydratesFiber.items.butternutSquash.description',
      },
    ],
  },
  {
    titleKey: 'categories.vegetablesProduce.title',
    items: [
      {
        nameKey: 'categories.vegetablesProduce.items.spinach.name',
        descriptionKey:
          'categories.vegetablesProduce.items.spinach.description',
      },
      {
        nameKey: 'categories.vegetablesProduce.items.blueberries.name',
        descriptionKey:
          'categories.vegetablesProduce.items.blueberries.description',
      },
      {
        nameKey: 'categories.vegetablesProduce.items.cucumber.name',
        descriptionKey:
          'categories.vegetablesProduce.items.cucumber.description',
      },
      {
        nameKey: 'categories.vegetablesProduce.items.parsley.name',
        descriptionKey:
          'categories.vegetablesProduce.items.parsley.description',
      },
      {
        nameKey: 'categories.vegetablesProduce.items.dill.name',
        descriptionKey: 'categories.vegetablesProduce.items.dill.description',
      },
    ],
  },
  {
    titleKey: 'categories.fatsFunctionalAdditions.title',
    items: [
      {
        nameKey: 'categories.fatsFunctionalAdditions.items.omega3FishOil.name',
        descriptionKey:
          'categories.fatsFunctionalAdditions.items.omega3FishOil.description',
      },
      {
        nameKey: 'categories.fatsFunctionalAdditions.items.canolaOil.name',
        descriptionKey:
          'categories.fatsFunctionalAdditions.items.canolaOil.description',
      },
      {
        nameKey:
          'categories.fatsFunctionalAdditions.items.flaxseedChiaSeed.name',
        descriptionKey:
          'categories.fatsFunctionalAdditions.items.flaxseedChiaSeed.description',
      },
    ],
  },
] as const

// Recipe page constants
export type RecipeTabType = 'turkey' | 'lamb' | 'seafood'

export const RECIPE_TABS: RecipeTabType[] = [
  'turkey',
  'lamb',
  'seafood',
] as const

// Benefit translation keys used on the recipe page
export const BENEFIT_KEYS = [
  'benefits.benefit1',
  'benefits.benefit2',
  'benefits.benefit3',
] as const

export const BENEFITS_COUNT = BENEFIT_KEYS.length

export interface FormulationCard {
  id: string
  titleKey: string
  descriptionKey: string
}

export const FORMULATION_CARDS: FormulationCard[] = [
  {
    id: 'protein',
    titleKey: 'highBiologicalValue.title',
    descriptionKey: 'highBiologicalValue.description',
  },
  {
    id: 'fat',
    titleKey: 'optimizedFatProfile.title',
    descriptionKey: 'optimizedFatProfile.description',
  },
  {
    id: 'carbs',
    titleKey: 'controlledCarbohydrates.title',
    descriptionKey: 'controlledCarbohydrates.description',
  },
  {
    id: 'micronutrients',
    titleKey: 'bioavailableMicronutrients.title',
    descriptionKey: 'bioavailableMicronutrients.description',
  },
  {
    id: 'functional',
    titleKey: 'functionalIngredients.title',
    descriptionKey: 'functionalIngredients.description',
  },
] as const

export interface NutrientRow {
  id: string
  nutrientKey: string
  minValue: string
  maxValue: string
}

export const NUTRIENT_DATA: Record<RecipeTabType, NutrientRow[]> = {
  turkey: [
    {
      id: 'protein',
      nutrientKey: 'crudeProtein',
      minValue: '46%',
      maxValue: '—',
    },
    {
      id: 'fat',
      nutrientKey: 'crudeFat',
      minValue: '15%',
      maxValue: '—',
    },
    {
      id: 'carbs',
      nutrientKey: 'crudeCarbs',
      minValue: '—',
      maxValue: '4%',
    },
    {
      id: 'fiber',
      nutrientKey: 'crudeFiber',
      minValue: '15%',
      maxValue: '—',
    },
  ],
  lamb: [
    {
      id: 'protein',
      nutrientKey: 'crudeProtein',
      minValue: '44%',
      maxValue: '—',
    },
    {
      id: 'fat',
      nutrientKey: 'crudeFat',
      minValue: '14%',
      maxValue: '—',
    },
    {
      id: 'carbs',
      nutrientKey: 'crudeCarbs',
      minValue: '—',
      maxValue: '5%',
    },
    {
      id: 'fiber',
      nutrientKey: 'crudeFiber',
      minValue: '14%',
      maxValue: '—',
    },
  ],
  seafood: [
    {
      id: 'protein',
      nutrientKey: 'crudeProtein',
      minValue: '48%',
      maxValue: '—',
    },
    {
      id: 'fat',
      nutrientKey: 'crudeFat',
      minValue: '12%',
      maxValue: '—',
    },
    {
      id: 'carbs',
      nutrientKey: 'crudeCarbs',
      minValue: '—',
      maxValue: '3%',
    },
    {
      id: 'fiber',
      nutrientKey: 'crudeFiber',
      minValue: '12%',
      maxValue: '—',
    },
  ],
} as const

export interface AccordionItem {
  id: string
  titleKey: string
}

export const NUTRITION_PANEL_ACCORDION_ITEMS: AccordionItem[] = [
  { id: 'micronutrients', titleKey: 'micronutrients' },
  { id: 'vitamins', titleKey: 'vitaminsAndMinerals' },
  { id: 'efas', titleKey: 'essentialFattyAcids' },
  { id: 'amino', titleKey: 'aminoAcidProfile' },
] as const
