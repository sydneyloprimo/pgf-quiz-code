import { ContentfulImage } from '@/components/common/ContentfulImage'
import { cn } from '@/utils/cn'

interface FeatureBoxSpecialProps {
  isEven: boolean
}

const FeatureBoxSpecial = ({ isEven }: FeatureBoxSpecialProps) => (
  <div
    className={cn(
      'flex flex-col items-center px-6 py-5 gap-8',
      'min-h-[442px]',
      isEven ? 'bg-neutral-400' : 'bg-neutral-300 border border-neutral-500'
    )}
  >
    <div className="relative flex flex-1 w-full min-h-0 items-center justify-center">
      <div className="relative w-72 h-72">
        <ContentfulImage
          src="/images/home/dog-standing.svg"
          alt=""
          fill
          className="object-contain opacity-90"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
)

export { FeatureBoxSpecial }
export type { FeatureBoxSpecialProps }
