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

// Quiz thresholds
export const PUPPY_MAX_AGE_YEARS = 1
export const MAX_DOG_WEIGHT_LBS = 25

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
  label: string
  value: string
}

export const ACTIVITY_LEVEL_OPTIONS: ActivityLevelOption[] = [
  { label: 'Couch Potato', value: 'couch-potato' },
  { label: 'Routine Walker', value: 'routine-walker' },
  { label: 'Actively Athletic', value: 'actively-athletic' },
]

// Quiz breeds
export const BREEDS: BreedOption[] = [
  { label: 'Shih Tzu', value: 'shih-tzu', category: 'Toy and Companion' },
  { label: 'Maltese', value: 'maltese', category: 'Toy and Companion' },
  {
    label: 'Yorkshire Terrier',
    value: 'yorkshire-terrier',
    category: 'Toy and Companion',
  },
  {
    label: 'Pomeranian',
    value: 'pomeranian',
    category: 'Toy and Companion',
  },
  { label: 'Papillon', value: 'papillon', category: 'Toy and Companion' },
  {
    label: 'Toy Poodle',
    value: 'toy-poodle',
    category: 'Toy and Companion',
  },
  { label: 'Chihuahua', value: 'chihuahua', category: 'Toy and Companion' },
  { label: 'Havanese', value: 'havanese', category: 'Toy and Companion' },
  {
    label: 'Japanese Chin',
    value: 'japanese-chin',
    category: 'Toy and Companion',
  },
  {
    label: 'Miniature Schnauzer',
    value: 'miniature-schnauzer',
    category: 'Small and stylish',
  },
  {
    label: 'Cavalier King Charles Spaniel',
    value: 'cavalier-king-charles-spaniel',
    category: 'Small and stylish',
  },
  {
    label: 'French Bulldog',
    value: 'french-bulldog',
    category: 'Small and stylish',
  },
  {
    label: 'Boston Terrier',
    value: 'boston-terrier',
    category: 'Small and stylish',
  },
  {
    label: 'Coton de Tuléar',
    value: 'coton-de-tulear',
    category: 'Small and stylish',
  },
  {
    label: 'Brussels Griffon',
    value: 'brussels-griffon',
    category: 'Small and stylish',
  },
  {
    label: 'Bichon Frise',
    value: 'bichon-frise',
    category: 'Small and stylish',
  },
  {
    label: 'Lhasa Apso',
    value: 'lhasa-apso',
    category: 'Small and stylish',
  },
  {
    label: 'Miniature Dachshund',
    value: 'miniature-dachshund',
    category: 'Sporting & Adventurous',
  },
  {
    label: 'Cocker Spaniel',
    value: 'cocker-spaniel',
    category: 'Sporting & Adventurous',
  },
  {
    label: 'Jack Russell Terrier',
    value: 'jack-russell-terrier',
    category: 'Sporting & Adventurous',
  },
  {
    label: 'West Highland White Terrier',
    value: 'west-highland-white-terrier',
    category: 'Sporting & Adventurous',
  },
  {
    label: 'Miniature Pinscher',
    value: 'miniature-pinscher',
    category: 'Sporting & Adventurous',
  },
  {
    label: 'Italian Greyhound',
    value: 'italian-greyhound',
    category: 'Sporting & Adventurous',
  },
  {
    label: 'Scottish Terrier',
    value: 'scottish-terrier',
    category: 'Sporting & Adventurous',
  },
]

// Quiz diet options
export interface DietOption {
  label: string
  value: string
}

export const MAIN_FOOD_OPTIONS: DietOption[] = [
  { label: 'dry food', value: 'dry-food' },
  { label: 'wet food', value: 'wet-food' },
  { label: 'raw food', value: 'raw-food' },
  { label: 'dehydrated food', value: 'dehydrated-food' },
  { label: 'fresh food', value: 'fresh-food' },
  { label: 'homemade food', value: 'homemade-food' },
  { label: 'mixed (combination)', value: 'mixed-combination' },
]

export const TREAT_FREQUENCY_OPTIONS: DietOption[] = [
  { label: 'no', value: 'no' },
  { label: '1-2 small', value: '1-2-small' },
  { label: 'several', value: 'several' },
  { label: 'lots (spoiled rotten)', value: 'lots-spoiled-rotten' },
]

export const MEALTIME_BEHAVIOR_OPTIONS: DietOption[] = [
  { label: 'very picky', value: 'very-picky' },
  { label: 'can be picky', value: 'can-be-picky' },
  { label: 'good eater', value: 'good-eater' },
  { label: 'will eat anything', value: 'will-eat-anything' },
]
