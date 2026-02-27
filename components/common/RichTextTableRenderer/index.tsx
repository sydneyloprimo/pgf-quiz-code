import {
  documentToReactComponents,
  type Options,
} from '@contentful/rich-text-react-renderer'
import { BLOCKS, type Document } from '@contentful/rich-text-types'

import { cn } from '@/utils/cn'

interface RichTextTableRendererProps {
  content: Document
}

function createOptions(): Options {
  let rowIndex = 0

  return {
    renderNode: {
      [BLOCKS.DOCUMENT]: (_node, children) => <>{children}</>,
      [BLOCKS.TABLE]: (_node, children) => {
        rowIndex = 0
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-quaternary-50 border border-tertiary-800">
              <tbody>{children}</tbody>
            </table>
          </div>
        )
      },
      [BLOCKS.TABLE_ROW]: (_node, children) => {
        const idx = rowIndex
        rowIndex++
        if (idx === 0) {
          return <tr className="bg-quaternary-200">{children}</tr>
        }
        const dataIdx = idx - 1
        const isEven = dataIdx % 2 === 0
        return (
          <tr
            className={cn(
              isEven ? 'bg-white' : 'bg-neutral-100',
              'border-b border-neutral-300 last:border-tertiary-800'
            )}
          >
            {children}
          </tr>
        )
      },
      [BLOCKS.TABLE_HEADER_CELL]: (_node, children) => (
        <th className="py-3 px-4 text-left font-sans text-sm font-semibold text-black first:text-left not-first:text-center">
          {children}
        </th>
      ),
      [BLOCKS.TABLE_CELL]: (_node, children) => (
        <td className="py-3 px-4 font-sans text-sm text-black first:text-left not-first:text-center">
          {children}
        </td>
      ),
      [BLOCKS.PARAGRAPH]: (_node, children) => <>{children}</>,
    },
  }
}

const RichTextTableRenderer = ({ content }: RichTextTableRendererProps) => {
  const options = createOptions()
  return <>{documentToReactComponents(content, options)}</>
}

export { RichTextTableRenderer }
