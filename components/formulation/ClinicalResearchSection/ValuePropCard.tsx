interface ValuePropCardProps {
  title: string
  description: string
}

const ValuePropCard = ({ title, description }: ValuePropCardProps) => (
  <div className="bg-neutral-300 border border-quaternary-500 flex flex-col px-12 py-15 flex-1">
    <div className="flex flex-col">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-4">
          <div
            className="h-12 border-l border-quaternary-500"
            aria-hidden="true"
          />
          <h3 className="font-display text-2xl leading-8 text-quaternary-800 whitespace-pre-line">
            {title}
          </h3>
        </div>
        <p className="font-sans text-base leading-6 text-quaternary-800">
          {description}
        </p>
      </div>
    </div>
  </div>
)

export { ValuePropCard }
