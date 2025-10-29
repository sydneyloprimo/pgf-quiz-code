const path = require('path')

const lintAndPrettify = (filenames) => [
  `yarn prettier --write ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`,
  `npx eslint --fix ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`,
]

module.exports = {
  '**/*.(ts|tsx)': () => 'yarn tsc --noEmit',
  '**/*.{js,jsx,ts,tsx}': [lintAndPrettify],
}
