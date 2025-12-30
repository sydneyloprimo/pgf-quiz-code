import Image from 'next/image'

const LoginDivider = () => (
  <div className="absolute bottom-0 left-0 right-0 z-[1]">
    <Image
      src="/images/login-divider.svg"
      alt=""
      width={1920}
      height={1}
      className="w-full h-auto"
    />
  </div>
)

export { LoginDivider }
