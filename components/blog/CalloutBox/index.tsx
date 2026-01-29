import { PropsWithChildren } from 'react'

interface CalloutBoxProps extends PropsWithChildren {
  heading?: string
}

const CalloutBox = ({ heading, children }: CalloutBoxProps) => {
  return (
    <aside className="bg-quaternary-100 border-l-4 border-quaternary-800 my-8 px-16 py-8">
      {heading && (
        <h3 className="font-sans text-lg font-bold leading-normal text-black">
          {heading}
        </h3>
      )}
      <div className="font-sans text-lg leading-normal text-black">
        {children}
      </div>
    </aside>
  )
}

export { CalloutBox }
