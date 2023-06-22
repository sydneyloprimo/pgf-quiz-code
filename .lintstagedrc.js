const path = require('path')

const lintAndPrettify = (filenames) => [
  `yarn prettier --write ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`,
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`,
]

module.exports = {
  '**/*.(ts|tsx)': () => 'yarn tsc --noEmit',
  '**/*.{json}': () => 'yarn lint:i18n',
  '**/*.{js,jsx,ts,tsx}': [lintAndPrettify],
}
