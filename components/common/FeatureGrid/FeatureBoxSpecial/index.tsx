import { ContentfulImage } from '@/components/common/ContentfulImage'
import { cn } from '@/utils/cn'

interface FeatureBoxSpecialProps {
  isEven: boolean
}

const FeatureBoxSpecial = ({ isEven }: FeatureBoxSpecialProps) => (
  <div
    className={cn(
      'flex items-center justify-center',
      'px-6 py-5',
      'aspect-square md:aspect-auto md:min-h-80',
      isEven ? 'bg-neutral-400' : 'bg-neutral-300 border border-neutral-500'
    )}
  >
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
)

export { FeatureBoxSpecial }
export type { FeatureBoxSpecialProps }
