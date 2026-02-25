/**
 * Returns the Contentful environment ID for sync scripts.
 * Default: staging. Use --master flag for production.
 */
export function getSyncEnvironmentId(): string {
  const useMaster = process.argv.includes('--master')
  return useMaster ? 'master' : 'staging'
}
