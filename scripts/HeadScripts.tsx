import Script from 'next/script'

import { GTM_AUTH, GTM_ID, GTM_PREVIEW } from '@/constants'

const gtmAuthParam = GTM_AUTH ? `&gtm_auth=${GTM_AUTH}` : ''
const gtmPreviewParam = GTM_PREVIEW
  ? `&gtm_preview=${GTM_PREVIEW}&gtm_cookies_win=x`
  : ''

const HeadScripts = () => (
  <>
    <Script
      id="gtm-head"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl+'${gtmAuthParam}${gtmPreviewParam}';f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
      }}
    />
    <link rel="stylesheet" href="https://use.typekit.net/dlw0pka.css" />
  </>
)

export default HeadScripts
