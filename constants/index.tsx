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
