import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { useRecipes } from '@/components/recipes/RecipesContext'

const RECIPE_BLOCK_INDICES = [1, 2, 3] as const

const RecipeDetails = () => {
  const t = useTranslations('Recipes.Detail')
  const { activeRecipe } = useRecipes()

  const recipeImageAlt = useMemo(() => {
    const imageAltKey = `${activeRecipe}ImageAlt` as const
    return t(imageAltKey)
  }, [activeRecipe, t])

  const blocks = useMemo(
    () =>
      RECIPE_BLOCK_INDICES.map((i) => ({
        id: i,
        heading: t(`${activeRecipe}Heading${i}` as const),
        paragraph: t(`${activeRecipe}Paragraph${i}` as const),
      })),
    [activeRecipe, t]
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-8">
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-md aspect-square">
          <Image
            src={`/images/recipes/recipe-bowl-${activeRecipe}.png`}
            alt={recipeImageAlt}
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {blocks.map((block, index) => (
          <div key={block.id} className="flex flex-col gap-3">
            {index > 0 && <hr className="border-tertiary-800" />}
            <h2 className="font-display text-2xl font-normal leading-normal text-tertiary-800">
              {block.heading}
            </h2>
            <p className="font-sans text-base leading-relaxed text-neutral-800">
              {block.paragraph}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export { RecipeDetails }
