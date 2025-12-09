import { QuizStep } from '@/types/enums/constants'
import { Routes } from '@/types/enums/routes'

const STEP_TO_PATH: Partial<Record<QuizStep, string>> = {
  [QuizStep.Welcome]: 'welcome',
  [QuizStep.PetInfo]: 'pet-info',
  [QuizStep.Plus25Lbs]: 'plus-25-lbs',
  [QuizStep.UnderAge]: 'under-age',
  [QuizStep.NeuteredStatus]: 'neutered-status',
  [QuizStep.BreedSelection]: 'breed-selection',
  [QuizStep.Step5]: 'body-shape',
  [QuizStep.Step6]: 'step6',
  [QuizStep.Step7]: 'step7',
  // Step8 (loading) is not a route - shown inline during Step7 → Results transition
  [QuizStep.Results]: 'results',
}

const PATH_TO_STEP: Record<string, QuizStep> = Object.entries(
  STEP_TO_PATH
).reduce(
  (acc, [step, path]) => {
    acc[path] = step as QuizStep
    return acc
  },
  {} as Record<string, QuizStep>
)

export const getQuizStepPath = (step: QuizStep): string => {
  // Step8 is not a route - return Results path instead
  if (step === QuizStep.Step8) {
    return `${Routes.quiz}/${STEP_TO_PATH[QuizStep.Results]}`
  }
  const path = STEP_TO_PATH[step]
  if (!path) {
    // Fallback to welcome if step doesn't have a path
    return `${Routes.quiz}/${STEP_TO_PATH[QuizStep.Welcome]}`
  }
  return `${Routes.quiz}/${path}`
}

export const getQuizStepFromPath = (path: string): QuizStep | null => {
  const quizBasePath = Routes.quiz
  const quizIndex = path.indexOf(quizBasePath)
  if (quizIndex === -1) {
    return null
  }
  const pathAfterQuiz = path.slice(quizIndex + quizBasePath.length)
  const stepPath = pathAfterQuiz.replace(/^\//, '').split('/')[0]
  return PATH_TO_STEP[stepPath] || null
}

export const isValidQuizStepPath = (path: string): boolean => {
  const stepPath = path.replace(`${Routes.quiz}/`, '')
  return stepPath in PATH_TO_STEP
}

export const STEP_ORDER: QuizStep[] = [
  QuizStep.Welcome,
  QuizStep.PetInfo,
  QuizStep.NeuteredStatus,
  QuizStep.BreedSelection,
  QuizStep.Step5,
  QuizStep.Step6,
  QuizStep.Step7,
  // Step8 (loading) is not in the order - shown inline, not a separate step
]

export const getStepNumber = (step: QuizStep): number => {
  const index = STEP_ORDER.indexOf(step)
  return index >= 0 ? index + 1 : 1
}
