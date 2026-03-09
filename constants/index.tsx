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
export const BLOG_FEATURED_IMAGE_DESKTOP_PATH =
  '/images/blog-featured-desktop.png'
export const BLOG_FEATURED_IMAGE_MOBILE_PATH =
  '/images/blog-featured-mobile.png'
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

export const facebookUrl =
  'https://www.facebook.com/profile.php?id=61588102861917'

export const instagramUrl = 'https://www.instagram.com/purelygoldenfoods/'

export interface FooterSocialLink {
  id: string
  href: string
  iconPath: string
  ariaLabelKey: string
}

export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  {
    id: 'facebook',
    href: facebookUrl,
    iconPath: '/icons/facebook.svg',
    ariaLabelKey: 'socialFacebookAria',
  },
  {
    id: 'instagram',
    href: instagramUrl,
    iconPath: '/icons/instagram.svg',
    ariaLabelKey: 'socialInstagramAria',
  },
]

export const QUIZ_RESULTS_ILLUSTRATION_WIDTH = 167
export const QUIZ_RESULTS_ILLUSTRATION_HEIGHT = 103

// Quiz thresholds
export const PUPPY_MAX_AGE_YEARS = 1
export const MAX_DOG_WEIGHT_LBS = 20

// Massachusetts ZIP codes for quiz location step (founding cohort enrollment)
export const MASSACHUSETTS_ZIP_CODES: ReadonlySet<string> = new Set([
  '01001',
  '01002',
  '01003',
  '01004',
  '01005',
  '01007',
  '01008',
  '01009',
  '01010',
  '01011',
  '01012',
  '01013',
  '01014',
  '01020',
  '01021',
  '01022',
  '01026',
  '01027',
  '01028',
  '01029',
  '01030',
  '01031',
  '01032',
  '01033',
  '01034',
  '01035',
  '01036',
  '01037',
  '01038',
  '01039',
  '01040',
  '01041',
  '01050',
  '01053',
  '01054',
  '01056',
  '01057',
  '01059',
  '01060',
  '01061',
  '01062',
  '01063',
  '01066',
  '01068',
  '01069',
  '01070',
  '01071',
  '01072',
  '01073',
  '01074',
  '01075',
  '01077',
  '01079',
  '01080',
  '01081',
  '01082',
  '01083',
  '01084',
  '01085',
  '01086',
  '01088',
  '01089',
  '01090',
  '01092',
  '01093',
  '01094',
  '01095',
  '01096',
  '01097',
  '01098',
  '01101',
  '01102',
  '01103',
  '01104',
  '01105',
  '01106',
  '01107',
  '01108',
  '01109',
  '01111',
  '01115',
  '01116',
  '01118',
  '01119',
  '01128',
  '01129',
  '01138',
  '01139',
  '01144',
  '01151',
  '01152',
  '01199',
  '01201',
  '01202',
  '01203',
  '01220',
  '01222',
  '01223',
  '01224',
  '01225',
  '01226',
  '01227',
  '01229',
  '01230',
  '01235',
  '01236',
  '01237',
  '01238',
  '01240',
  '01242',
  '01243',
  '01244',
  '01245',
  '01247',
  '01252',
  '01253',
  '01254',
  '01255',
  '01256',
  '01257',
  '01258',
  '01259',
  '01260',
  '01262',
  '01263',
  '01264',
  '01266',
  '01267',
  '01270',
  '01301',
  '01302',
  '01330',
  '01331',
  '01337',
  '01338',
  '01339',
  '01340',
  '01341',
  '01342',
  '01343',
  '01344',
  '01346',
  '01347',
  '01349',
  '01350',
  '01351',
  '01354',
  '01355',
  '01360',
  '01364',
  '01366',
  '01367',
  '01368',
  '01370',
  '01373',
  '01375',
  '01376',
  '01378',
  '01379',
  '01380',
  '01420',
  '01430',
  '01431',
  '01432',
  '01434',
  '01436',
  '01438',
  '01440',
  '01441',
  '01450',
  '01451',
  '01452',
  '01453',
  '01460',
  '01462',
  '01463',
  '01464',
  '01467',
  '01468',
  '01469',
  '01470',
  '01471',
  '01472',
  '01473',
  '01474',
  '01475',
  '01501',
  '01503',
  '01504',
  '01505',
  '01506',
  '01507',
  '01508',
  '01509',
  '01510',
  '01515',
  '01516',
  '01518',
  '01519',
  '01520',
  '01521',
  '01522',
  '01523',
  '01524',
  '01525',
  '01526',
  '01527',
  '01529',
  '01531',
  '01532',
  '01534',
  '01535',
  '01536',
  '01537',
  '01538',
  '01540',
  '01541',
  '01542',
  '01543',
  '01545',
  '01546',
  '01550',
  '01560',
  '01561',
  '01562',
  '01564',
  '01566',
  '01568',
  '01569',
  '01570',
  '01571',
  '01581',
  '01583',
  '01585',
  '01586',
  '01588',
  '01590',
  '01601',
  '01602',
  '01603',
  '01604',
  '01605',
  '01606',
  '01607',
  '01608',
  '01609',
  '01610',
  '01611',
  '01612',
  '01613',
  '01614',
  '01615',
  '01653',
  '01655',
  '01701',
  '01702',
  '01703',
  '01704',
  '01705',
  '01718',
  '01719',
  '01720',
  '01721',
  '01730',
  '01731',
  '01740',
  '01741',
  '01742',
  '01745',
  '01746',
  '01747',
  '01748',
  '01749',
  '01752',
  '01754',
  '01756',
  '01757',
  '01760',
  '01770',
  '01772',
  '01773',
  '01775',
  '01776',
  '01778',
  '01784',
  '01801',
  '01803',
  '01805',
  '01810',
  '01812',
  '01813',
  '01815',
  '01821',
  '01822',
  '01824',
  '01825',
  '01826',
  '01827',
  '01830',
  '01831',
  '01832',
  '01833',
  '01834',
  '01835',
  '01840',
  '01841',
  '01842',
  '01843',
  '01844',
  '01845',
  '01850',
  '01851',
  '01852',
  '01853',
  '01854',
  '01860',
  '01862',
  '01863',
  '01864',
  '01865',
  '01866',
  '01867',
  '01876',
  '01879',
  '01880',
  '01885',
  '01886',
  '01887',
  '01888',
  '01889',
  '01890',
  '01899',
  '01901',
  '01902',
  '01903',
  '01904',
  '01905',
  '01906',
  '01907',
  '01908',
  '01910',
  '01913',
  '01915',
  '01921',
  '01922',
  '01923',
  '01929',
  '01930',
  '01931',
  '01936',
  '01937',
  '01938',
  '01940',
  '01944',
  '01945',
  '01949',
  '01950',
  '01951',
  '01952',
  '01960',
  '01961',
  '01965',
  '01966',
  '01969',
  '01970',
  '01971',
  '01982',
  '01983',
  '01984',
  '01985',
  '02018',
  '02019',
  '02020',
  '02021',
  '02025',
  '02026',
  '02027',
  '02030',
  '02032',
  '02035',
  '02038',
  '02040',
  '02041',
  '02043',
  '02044',
  '02045',
  '02047',
  '02048',
  '02050',
  '02051',
  '02052',
  '02053',
  '02054',
  '02055',
  '02056',
  '02059',
  '02060',
  '02061',
  '02062',
  '02065',
  '02066',
  '02067',
  '02070',
  '02071',
  '02072',
  '02081',
  '02090',
  '02093',
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
  '02137',
  '02138',
  '02139',
  '02140',
  '02141',
  '02142',
  '02143',
  '02144',
  '02145',
  '02148',
  '02149',
  '02150',
  '02151',
  '02152',
  '02153',
  '02155',
  '02156',
  '02163',
  '02169',
  '02170',
  '02171',
  '02176',
  '02180',
  '02184',
  '02185',
  '02186',
  '02187',
  '02188',
  '02189',
  '02190',
  '02191',
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
  '02238',
  '02241',
  '02269',
  '02283',
  '02284',
  '02293',
  '02297',
  '02298',
  '02301',
  '02302',
  '02303',
  '02304',
  '02305',
  '02322',
  '02324',
  '02325',
  '02327',
  '02330',
  '02331',
  '02332',
  '02333',
  '02334',
  '02337',
  '02338',
  '02339',
  '02341',
  '02343',
  '02344',
  '02345',
  '02346',
  '02347',
  '02348',
  '02349',
  '02350',
  '02351',
  '02355',
  '02356',
  '02357',
  '02358',
  '02359',
  '02360',
  '02361',
  '02362',
  '02364',
  '02366',
  '02367',
  '02368',
  '02370',
  '02375',
  '02379',
  '02381',
  '02382',
  '02420',
  '02421',
  '02445',
  '02446',
  '02447',
  '02451',
  '02452',
  '02453',
  '02454',
  '02455',
  '02456',
  '02457',
  '02458',
  '02459',
  '02460',
  '02461',
  '02462',
  '02464',
  '02465',
  '02466',
  '02467',
  '02468',
  '02471',
  '02472',
  '02474',
  '02475',
  '02476',
  '02477',
  '02478',
  '02479',
  '02481',
  '02482',
  '02492',
  '02493',
  '02494',
  '02495',
  '02532',
  '02534',
  '02535',
  '02536',
  '02537',
  '02538',
  '02539',
  '02540',
  '02541',
  '02542',
  '02543',
  '02552',
  '02553',
  '02554',
  '02556',
  '02557',
  '02558',
  '02559',
  '02561',
  '02562',
  '02563',
  '02564',
  '02568',
  '02571',
  '02574',
  '02575',
  '02576',
  '02584',
  '02601',
  '02630',
  '02631',
  '02632',
  '02633',
  '02634',
  '02635',
  '02637',
  '02638',
  '02639',
  '02641',
  '02642',
  '02643',
  '02644',
  '02645',
  '02646',
  '02647',
  '02648',
  '02649',
  '02650',
  '02651',
  '02652',
  '02653',
  '02655',
  '02657',
  '02659',
  '02660',
  '02661',
  '02662',
  '02663',
  '02664',
  '02666',
  '02667',
  '02668',
  '02669',
  '02670',
  '02671',
  '02672',
  '02673',
  '02675',
  '02702',
  '02703',
  '02712',
  '02713',
  '02714',
  '02715',
  '02717',
  '02718',
  '02719',
  '02720',
  '02721',
  '02722',
  '02723',
  '02724',
  '02725',
  '02726',
  '02738',
  '02739',
  '02740',
  '02741',
  '02742',
  '02743',
  '02744',
  '02745',
  '02746',
  '02747',
  '02748',
  '02760',
  '02761',
  '02762',
  '02763',
  '02764',
  '02766',
  '02767',
  '02768',
  '02769',
  '02770',
  '02771',
  '02777',
  '02779',
  '02780',
  '02790',
  '02791',
])

export const MIN_ZIP_CODE_LENGTH = 5
export const QUIZ_LOADING_DURATION_MS = 5000
export const FEATURE_FLAG_LAMB = 'LambEnabled'
export const FEATURE_FLAG_PANCREATIC = 'PancreaticEnabled'
export const FEATURE_FLAG_REVIEWS = 'ReviewsEnabled'
export const FEATURE_FLAG_WAITLIST = 'waitlistFlip'
export const QUIZ_ENROLLMENT_TAGS = ['quiz-enrollment', 'beta-cohort'] as const
export const QUIZ_RESULTS_NOTE_LABEL = 'Results link'
export const DOG_PROFILE_SEPARATOR = '\n\n--- Dog Profile ---\n\n'

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
    pointerLabelKey: 'pointerEnergy',
    pointerPosition: {
      mobile: { top: '48%', left: '50%' },
      md: { top: '48%', left: '61%' },
      lg: { top: '48%', left: '65%' },
    },
    labelSide: 'right',
    benefitIndex: 1,
  },
  {
    titleKey: 'benefit3Title',
    descriptionKey: 'benefit3Description',
    pointerLabelKey: 'pointerDigestive',
    pointerPosition: {
      mobile: { top: '59%', left: '46%' },
      md: { top: '64%', right: '18%' },
      lg: { bottom: '30%', left: '60%' },
    },
    labelSide: 'right',
    benefitIndex: 2,
  },
  {
    titleKey: 'benefit4Title',
    descriptionKey: 'benefit4Description',
    pointerLabelKey: 'pointerMicrobiome',
    pointerPosition: {
      mobile: { top: '68%', right: '39%' },
      md: { top: '70%', right: '53%' },
      lg: { top: '70%', left: '6%' },
    },
    labelSide: 'left',
    benefitIndex: 3,
  },
  {
    titleKey: 'benefit5Title',
    descriptionKey: 'benefit5Description',
    pointerLabelKey: 'pointerQuality',
    pointerPosition: {
      mobile: { bottom: '11%', right: '56%' },
      md: { bottom: '15%', right: '68%' },
      lg: { bottom: '15%', right: '66%' },
    },
    labelSide: 'left',
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

// Product configuration for cart operations (from env vars)
export interface ProductConfig {
  variantId: string
  sellingPlanIds: {
    weekly: string | null
    biweekly: string | null
  }
}

// Default IDs when env vars are not set (e.g. .env.local not loaded)
const DEFAULTS = {
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

const getProductConfigs = (): Record<
  'turkey' | 'lamb' | 'pancreatic',
  ProductConfig
> => ({
  turkey: {
    variantId:
      process.env.NEXT_PUBLIC_TURKEY_VARIANT_ID || DEFAULTS.turkey.variantId,
    sellingPlanIds: {
      weekly:
        process.env.NEXT_PUBLIC_TURKEY_SELLING_PLAN_WEEKLY ||
        DEFAULTS.turkey.sellingPlanIds.weekly,
      biweekly:
        process.env.NEXT_PUBLIC_TURKEY_SELLING_PLAN_BIWEEKLY ||
        DEFAULTS.turkey.sellingPlanIds.biweekly,
    },
  },
  lamb: {
    variantId:
      process.env.NEXT_PUBLIC_LAMB_VARIANT_ID || DEFAULTS.lamb.variantId,
    sellingPlanIds: {
      weekly:
        process.env.NEXT_PUBLIC_LAMB_SELLING_PLAN_WEEKLY ||
        DEFAULTS.lamb.sellingPlanIds.weekly,
      biweekly:
        process.env.NEXT_PUBLIC_LAMB_SELLING_PLAN_BIWEEKLY ||
        DEFAULTS.lamb.sellingPlanIds.biweekly,
    },
  },
  pancreatic: {
    variantId:
      process.env.NEXT_PUBLIC_PANCREATIC_VARIANT_ID ||
      DEFAULTS.pancreatic.variantId,
    sellingPlanIds: {
      weekly:
        process.env.NEXT_PUBLIC_PANCREATIC_SELLING_PLAN_WEEKLY ||
        DEFAULTS.pancreatic.sellingPlanIds.weekly,
      biweekly:
        process.env.NEXT_PUBLIC_PANCREATIC_SELLING_PLAN_BIWEEKLY ||
        DEFAULTS.pancreatic.sellingPlanIds.biweekly,
    },
  },
})

export const PRODUCT_CONFIGS = getProductConfigs()

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

export interface FormulationCard {
  id: string
  titleKey: string
  descriptionKey: string
}

export const FORMULATION_CARDS: FormulationCard[] = [
  {
    id: '1',
    titleKey: 'FormulationLogicTitle1',
    descriptionKey: 'FormulationLogicDescription1',
  },
  {
    id: '2',
    titleKey: 'FormulationLogicTitle2',
    descriptionKey: 'FormulationLogicDescription2',
  },
  {
    id: '3',
    titleKey: 'FormulationLogicTitle3',
    descriptionKey: 'FormulationLogicDescription3',
  },
  {
    id: '4',
    titleKey: 'FormulationLogicTitle4',
    descriptionKey: 'FormulationLogicDescription4',
  },
  {
    id: '5',
    titleKey: 'FormulationLogicTitle5',
    descriptionKey: 'FormulationLogicDescription5',
  },
]

export interface NutritionPanelSectionConfig {
  id: 'minerals' | 'vitamins' | 'fats' | 'aminoAcids'
  titleKey: string
  subheadKey: string
}

export const NUTRITION_PANEL_SECTIONS: NutritionPanelSectionConfig[] = [
  {
    id: 'minerals',
    titleKey: 'minerals',
    subheadKey: 'mineralsSubhead',
  },
  {
    id: 'vitamins',
    titleKey: 'vitamins',
    subheadKey: 'vitaminsSubhead',
  },
  {
    id: 'fats',
    titleKey: 'fats',
    subheadKey: 'fatsSubhead',
  },
  {
    id: 'aminoAcids',
    titleKey: 'aminoAcids',
    subheadKey: 'aminoAcidsSubhead',
  },
] as const
