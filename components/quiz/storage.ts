export const QUIZ_FORM_STORAGE_KEY = 'quiz-form-data'
export const QUIZ_PERSONAL_DATA_KEY = 'quiz-personal-data'

export const clearFormData = () => {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.removeItem(QUIZ_FORM_STORAGE_KEY)
  } catch {
    // Ignore localStorage errors
  }
}

export const clearPersonalData = () => {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.removeItem(QUIZ_PERSONAL_DATA_KEY)
  } catch {
    // Ignore localStorage errors
  }
}
