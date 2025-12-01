import { QuizStep } from '@/types/enums/constants'
import { Routes } from '@/types/enums/routes'

const STEP_TO_PATH: Record<QuizStep, string> = {
  [QuizStep.Welcome]: 'welcome',
  [QuizStep.PetInfo]: 'pet-info',
  [QuizStep.Plus25Lbs]: 'plus-25-lbs',
  [QuizStep.UnderAge]: 'under-age',
  [QuizStep.Step3]: 'neutered-status',
  [QuizStep.Step4]: 'step4',
  [QuizStep.Step5]: 'step5',
  [QuizStep.Step6]: 'step6',
  [QuizStep.Step7]: 'step7',
  [QuizStep.Step8]: 'step8',
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
  return `${Routes.quiz}/${STEP_TO_PATH[step]}`
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
  QuizStep.Step3,
  QuizStep.Step4,
  QuizStep.Step5,
  QuizStep.Step6,
  QuizStep.Step7,
  QuizStep.Step8,
]

export const getStepNumber = (step: QuizStep): number => {
  const index = STEP_ORDER.indexOf(step)
  return index >= 0 ? index + 1 : 1
}
