'use client'

import { useCallback, useState } from 'react'

import { ChevronIcon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface Section {
  id: string
  title: string
  content: string
}

interface ProductDetailPanelSectionsProps {
  sections: Section[]
}

const ProductDetailPanelSections = ({
  sections,
}: ProductDetailPanelSectionsProps) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())

  const handleToggleSection = useCallback((sectionId: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }, [])

  return (
    <div className="flex flex-col gap-6 w-full">
      {sections.map((section) => {
        const isOpen = openSections.has(section.id)

        return (
          <div key={section.id} className="flex flex-col gap-0 w-full">
            <button
              type="button"
              onClick={() => handleToggleSection(section.id)}
              className={cn(
                'flex gap-2.5 items-start p-0 w-full',
                'cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-primary-600'
              )}
              aria-expanded={isOpen}
              aria-controls={`section-${section.id}`}
            >
              <p
                className={cn(
                  'flex-1 min-w-0',
                  'font-sans font-bold leading-6 text-base',
                  'text-neutral-950 text-left',
                  'whitespace-pre-wrap'
                )}
              >
                {section.title}
              </p>
              <div className="relative shrink-0 size-6">
                <ChevronIcon
                  direction={isOpen ? 'up' : 'down'}
                  className="size-6 text-neutral-950"
                  aria-hidden="true"
                />
              </div>
            </button>
            {isOpen && (
              <div
                id={`section-${section.id}`}
                className="mt-4 p-0 w-full"
                role="region"
                aria-labelledby={`section-title-${section.id}`}
              >
                <p
                  className={cn(
                    'font-sans font-normal leading-6 text-base',
                    'text-neutral-950',
                    'whitespace-pre-wrap'
                  )}
                >
                  {section.content}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { ProductDetailPanelSections }
export type { ProductDetailPanelSectionsProps }
