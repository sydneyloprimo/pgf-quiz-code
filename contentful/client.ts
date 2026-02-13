import { createClient } from 'contentful'

import { CONTENTFUL_CLIENT_DEFAULTS } from './config'

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  host: CONTENTFUL_CLIENT_DEFAULTS.host,
})
