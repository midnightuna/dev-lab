import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import matter from 'gray-matter'
import type { ZodError } from 'zod'

import type { ContentIssue, Post } from './domain.ts'
import { extractExcerpt } from './excerpt.ts'
import { postFrontmatterSchema, type PostFrontmatter } from './schema.ts'
import { parseYaml } from './yaml.ts'

export interface ParsedPost {
  readonly post?: Post
  readonly issues: readonly ContentIssue[]
}

class FrontmatterYamlError extends Error {
  readonly issues: readonly ContentIssue[]

  constructor(issues: readonly ContentIssue[]) {
    super('Frontmatter YAML parsing failed')
    this.issues = issues
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const readPath = (value: unknown, path: readonly PropertyKey[]): unknown => {
  let current = value

  for (const key of path) {
    if (!isRecord(current) && !Array.isArray(current)) {
      return undefined
    }

    current = current[key as keyof typeof current]
  }

  return current
}

const zodIssues = (error: ZodError, sourcePath: string, received: unknown): ContentIssue[] =>
  error.issues.map((issue) => ({
    path: sourcePath,
    field: issue.path.length > 0 ? issue.path.join('.') : 'frontmatter',
    cause: issue.message,
    received: readPath(received, issue.path),
  }))

const parseFrontmatterYaml = (source: string, sourcePath: string): object => {
  const result = parseYaml(source, sourcePath)

  if (!result.success) {
    throw new FrontmatterYamlError(result.issues)
  }

  if (!isRecord(result.value)) {
    throw new FrontmatterYamlError([
      {
        path: sourcePath,
        field: 'frontmatter',
        cause: 'must be a YAML mapping',
        received: result.value,
      },
    ])
  }

  return result.value
}

const duplicateTagIssues = (frontmatter: PostFrontmatter, sourcePath: string): ContentIssue[] => {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  for (const tag of frontmatter.tags) {
    if (seen.has(tag)) {
      duplicates.add(tag)
    }
    seen.add(tag)
  }

  return [...duplicates].map((tag) => ({
    path: sourcePath,
    field: 'tags',
    cause: 'contains a duplicate tag',
    received: tag,
  }))
}

export const discoverPostFiles = (postsDirectory: string): string[] => {
  const files: string[] = []

  const visit = (directory: string): void => {
    const entries = readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
      left.name.localeCompare(right.name),
    )

    for (const entry of entries) {
      const path = join(directory, entry.name)

      if (entry.isDirectory()) {
        visit(path)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(path)
      }
    }
  }

  visit(postsDirectory)
  return files
}

export const parsePost = (filePath: string, sourcePath: string): ParsedPost => {
  let source: string

  try {
    source = readFileSync(filePath, 'utf8')
  } catch (error) {
    return {
      issues: [
        {
          path: sourcePath,
          field: 'file',
          cause: error instanceof Error ? error.message : 'could not read file',
        },
      ],
    }
  }

  if (!source.startsWith('---\n') && !source.startsWith('---\r\n')) {
    return {
      issues: [
        {
          path: sourcePath,
          field: 'frontmatter',
          cause: 'must start with an untyped YAML delimiter (---)',
        },
      ],
    }
  }

  let parsed: ReturnType<typeof matter>

  try {
    parsed = matter(source, {
      language: 'yaml',
      engines: {
        yaml: (frontmatter) => parseFrontmatterYaml(frontmatter, sourcePath),
      },
    })
  } catch (error) {
    if (error instanceof FrontmatterYamlError) {
      return { issues: error.issues }
    }

    return {
      issues: [
        {
          path: sourcePath,
          field: 'frontmatter',
          cause: error instanceof Error ? error.message : 'could not parse frontmatter',
        },
      ],
    }
  }

  const frontmatterInput: unknown = parsed.data
  const frontmatterResult = postFrontmatterSchema.safeParse(frontmatterInput)

  if (!frontmatterResult.success) {
    return {
      issues: zodIssues(frontmatterResult.error, sourcePath, frontmatterInput),
    }
  }

  const issues = duplicateTagIssues(frontmatterResult.data, sourcePath)
  const excerpt = frontmatterResult.data.excerpt ?? extractExcerpt(parsed.content)

  if (excerpt === undefined) {
    issues.push({
      path: sourcePath,
      field: 'excerpt',
      cause: 'is required when the Markdown body has no non-empty paragraph',
    })
  }

  if (excerpt === undefined) {
    return { issues }
  }

  const { title, slug, status, date, updatedAt, tags, series, thumbnail } = frontmatterResult.data

  return {
    post: Object.freeze({
      sourcePath,
      title,
      slug,
      status,
      date,
      updatedAt,
      excerpt,
      tags: Object.freeze([...tags]),
      series,
      thumbnail,
      body: parsed.content,
    }),
    issues,
  }
}
