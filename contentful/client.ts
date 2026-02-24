import { createClient } from 'contentful'

import {
  CONTENTFUL_CLIENT_DEFAULTS,
  getContentfulEnvironmentId,
} from './config'

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  host: CONTENTFUL_CLIENT_DEFAULTS.host,
  environment: getContentfulEnvironmentId(),
})

/** Preview API client for fresher asset data (e.g. image map). */
export const contentfulPreviewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!,
  host: 'preview.contentful.com',
  environment: getContentfulEnvironmentId(),
})
