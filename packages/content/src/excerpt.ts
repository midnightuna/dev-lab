import { toString } from 'mdast-util-to-string'
import { unified } from 'unified'
import remarkParse from 'remark-parse'

export const extractExcerpt = (markdown: string): string | undefined => {
  const tree = unified().use(remarkParse).parse(markdown)

  for (const node of tree.children) {
    if (node.type !== 'paragraph') {
      continue
    }

    const excerpt = toString(node).replace(/\s+/g, ' ').trim()

    if (excerpt.length > 0) {
      return excerpt
    }
  }

  return undefined
}
