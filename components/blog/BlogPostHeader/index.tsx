interface BlogPostHeaderProps {
  title: string
  subtitle?: string
}

const BlogPostHeader = ({ title, subtitle }: BlogPostHeaderProps) => {
  return (
    <header className="w-full px-5 lg:px-24 py-16 lg:pb-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-4xl leading-normal text-secondary-950">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 font-sans text-xl leading-normal text-black">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  )
}

export { BlogPostHeader }
