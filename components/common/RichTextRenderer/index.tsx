import {
  documentToReactComponents,
  type Options,
} from '@contentful/rich-text-react-renderer'
import {
  BLOCKS,
  INLINES,
  MARKS,
  type Document,
} from '@contentful/rich-text-types'

import { CalloutBox } from '@/components/blog/CalloutBox'

interface RichTextRendererProps {
  content: Document
  className?: string
  variant?: 'default' | 'blog'
}

const RichTextRenderer = ({
  content,
  className,
  variant = 'default',
}: RichTextRendererProps) => {
  const isBlog = variant === 'blog'

  const options: Options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => {
        const isInsideListItem =
          node &&
          'content' in node &&
          Array.isArray(node.content) &&
          node.content[0]?.nodeType !== 'list-item'
        return (
          <p
            className={
              isBlog
                ? 'font-sans text-lg leading-normal text-black mb-6'
                : 'font-sans text-base leading-6 text-secondary-900 text-center mb-6'
            }
          >
            {children}
          </p>
        )
      },
      [BLOCKS.HEADING_1]: (_node, children) => (
        <h1
          className={
            isBlog
              ? 'font-display text-3xl font-bold mb-6 text-black'
              : 'font-display text-3xl font-bold mb-4'
          }
        >
          {children}
        </h1>
      ),
      [BLOCKS.HEADING_2]: (_node, children) => (
        <h2
          className={
            isBlog
              ? 'font-display text-2xl font-bold mb-4 text-black'
              : 'font-display text-2xl font-bold mb-3'
          }
        >
          {children}
        </h2>
      ),
      [BLOCKS.HEADING_3]: (_node, children) => (
        <h3
          className={
            isBlog
              ? 'font-display text-xl font-bold mb-3 text-black'
              : 'font-display text-xl font-bold mb-2'
          }
        >
          {children}
        </h3>
      ),
      [BLOCKS.QUOTE]: (_node, children) => {
        if (isBlog) {
          return <CalloutBox>{children}</CalloutBox>
        }
        return (
          <blockquote className="border-l-4 pl-4 italic">{children}</blockquote>
        )
      },
      [BLOCKS.UL_LIST]: (_node, children) => (
        <ul
          className={
            isBlog
              ? 'list-disc list-outside ml-6 mb-6 space-y-2'
              : 'list-disc list-inside mb-4'
          }
        >
          {children}
        </ul>
      ),
      [BLOCKS.OL_LIST]: (_node, children) => (
        <ol
          className={
            isBlog
              ? 'list-decimal list-outside ml-6 mb-6 space-y-2'
              : 'list-decimal list-inside mb-4'
          }
        >
          {children}
        </ol>
      ),
      [BLOCKS.LIST_ITEM]: (_node, children) => (
        <li
          className={
            isBlog
              ? 'font-sans text-lg text-black [&>p]:mb-0'
              : 'mb-2 [&>p]:mb-0'
          }
        >
          {children}
        </li>
      ),
      [INLINES.HYPERLINK]: (node, children) => {
        const uri =
          node && 'data' in node && node.data && 'uri' in node.data
            ? (node.data.uri as string)
            : '#'
        return (
          <a
            href={uri}
            className="text-primary-600 underline hover:text-primary-700"
          >
            {children}
          </a>
        )
      },
    },
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
      [MARKS.CODE]: (text) => (
        <code className="bg-neutral-200 px-1 rounded">{text}</code>
      ),
    },
  }

  return (
    <div className={className}>
      {documentToReactComponents(content, options)}
    </div>
  )
}

export { RichTextRenderer }
export type { Document as RichTextDocument }
