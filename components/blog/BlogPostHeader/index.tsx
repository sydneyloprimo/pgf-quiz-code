interface BlogPostHeaderProps {
  title: string
  subtitle?: string
}

const BlogPostHeader = ({ title, subtitle }: BlogPostHeaderProps) => {
  return (
    <header>
      <h1 className="font-display text-4xl leading-normal text-secondary-950">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 font-sans text-xl leading-normal text-black">
          {subtitle}
        </p>
      )}
    </header>
  )
}

export { BlogPostHeader }
