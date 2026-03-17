export const safeSessionStorage = {
  getItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key)
    } catch {
      return null
    }
  },

  setItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value)
    } catch {
      // Storage disabled or quota exceeded — silently ignore
    }
  },

  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch {
      // Storage disabled — silently ignore
    }
  },
}
