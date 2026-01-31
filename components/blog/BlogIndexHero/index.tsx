interface BlogIndexHeroProps {
  headline: string
  subheadline: string
}

const BlogIndexHero = ({ headline, subheadline }: BlogIndexHeroProps) => {
  return (
    <section className="w-full px-5 pb-6 pt-16 text-center lg:px-24 lg:pb-8 lg:pt-20">
      <div className="mx-auto max-w-6xl">
        <h1 className="heading-h1 text-secondary-950">{headline}</h1>
        <p className="mt-4 whitespace-pre-line font-sans text-body-l leading-normal text-neutral-950">
          {subheadline}
        </p>
      </div>
    </section>
  )
}

export { BlogIndexHero }
