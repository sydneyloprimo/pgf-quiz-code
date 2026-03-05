import { useTranslations } from 'next-intl'

import { ContentfulImage } from '@/components/common/ContentfulImage'

const FooterImage = () => {
  const t = useTranslations('Footer')
  return (
    <div className="w-full lg:flex-1 relative min-h-80 lg:min-h-[500px] order-2 lg:order-0">
      <ContentfulImage
        src="/images/home/footer-dog.png"
        alt={t('footerImageAlt')}
        fill
        className="object-cover object-top"
      />
    </div>
  )
}

export { FooterImage }
