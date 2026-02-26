import { ContentfulImage } from '@/components/common/ContentfulImage'

const LoginDivider = () => (
  <div className="absolute bottom-0 left-0 right-0 z-1" aria-hidden="true">
    <ContentfulImage
      src="/images/login-divider.svg"
      alt=""
      width={1920}
      height={1}
      className="w-full h-auto"
    />
  </div>
)

export { LoginDivider }
