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

interface RichTextRendererProps {
  content: Document
  className?: string
}

const RichTextRenderer = ({ content, className }: RichTextRendererProps) => {
  const options: Options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node, children) => (
        <p className="font-sans text-base leading-6 text-secondary-900 text-center mb-6">
          {children}
        </p>
      ),
      [BLOCKS.HEADING_1]: (_node, children) => (
        <h1 className="font-display text-3xl font-bold mb-4">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (_node, children) => (
        <h2 className="font-display text-2xl font-bold mb-3">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (_node, children) => (
        <h3 className="font-display text-xl font-bold mb-2">{children}</h3>
      ),
      [BLOCKS.UL_LIST]: (_node, children) => (
        <ul className="list-disc list-inside mb-4">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (_node, children) => (
        <ol className="list-decimal list-inside mb-4">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (_node, children) => (
        <li className="mb-2">{children}</li>
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
