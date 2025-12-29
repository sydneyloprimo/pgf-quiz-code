import { cn } from '@/utils/cn'

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full max-w-3xl border-b border-tertiary-200 pb-8 md:pb-9 pt-3 flex flex-col gap-3 text-center"
    aria-expanded={isOpen}
  >
    <h3
      className={cn(
        'font-display text-xl md:text-3xl leading-tight md:leading-10 tracking-tight cursor-pointer',
        isOpen ? 'text-secondary-800 font-semibold' : 'text-secondary-900'
      )}
    >
      {question}
    </h3>
    {isOpen && (
      <p className="font-sans text-base md:text-lg leading-6 md:leading-7 text-secondary-950 pl-5 md:pl-8">
        {answer}
      </p>
    )}
  </button>
)

export { FAQItem }
export type { FAQItemProps }
