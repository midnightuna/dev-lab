import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type {
  ContentCatalog,
  ContentIssue,
  LoadContentOptions,
  Post,
  SeriesDefinition,
  TagDefinition,
  ValidationResult,
} from './domain.ts'
import { discoverPostFiles, parsePost } from './parser.ts'
import { parseSeriesRegistry } from './series.ts'
import { parseTagRegistry } from './tags.ts'
import { ContentValidationError } from './validation.ts'
import { isPostVisible } from './visibility.ts'

const getDefaultContentDirectory = (): string =>
  resolve(dirname(fileURLToPath(import.meta.url)), '../../../content')

const compareNewestFirst = (left: Post, right: Post): number =>
  right.date.localeCompare(left.date) || left.slug.localeCompare(right.slug)

const compareOldestFirst = (left: Post, right: Post): number =>
  left.date.localeCompare(right.date) || left.slug.localeCompare(right.slug)

const getSeoulDate = (date: Date): string => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = new Map(parts.map((part) => [part.type, part.value]))

  return `${values.get('year')}-${values.get('month')}-${values.get('day')}`
}

const displayPath = (contentDirectory: string, filePath: string): string =>
  relative(dirname(contentDirectory), filePath)

const validatePosts = (
  posts: readonly Post[],
  tags: readonly TagDefinition[] | undefined,
  series: readonly SeriesDefinition[] | undefined,
  today: string,
): ContentIssue[] => {
  const issues: ContentIssue[] = []
  const slugs = new Map<string, string>()
  const registeredTags = tags === undefined ? undefined : new Set(tags.map((tag) => tag.slug))
  const registeredSeries =
    series === undefined ? undefined : new Set(series.map((definition) => definition.slug))

  for (const post of posts) {
    const existingPath = slugs.get(post.slug)

    if (existingPath !== undefined) {
      issues.push({
        path: post.sourcePath,
        field: 'slug',
        cause: `duplicates the slug declared in ${existingPath}`,
        received: post.slug,
      })
    } else {
      slugs.set(post.slug, post.sourcePath)
    }

    if (registeredTags !== undefined) {
      for (const tag of post.tags) {
        if (!registeredTags.has(tag)) {
          issues.push({
            path: post.sourcePath,
            field: 'tags',
            cause: 'contains an unregistered tag',
            received: tag,
          })
        }
      }
    }

    if (
      post.series !== undefined &&
      registeredSeries !== undefined &&
      !registeredSeries.has(post.series)
    ) {
      issues.push({
        path: post.sourcePath,
        field: 'series',
        cause: 'references an unregistered series',
        received: post.series,
      })
    }

    if (post.status === 'published' && post.date > today) {
      issues.push({
        path: post.sourcePath,
        field: 'date',
        cause: `published posts cannot use a future date relative to ${today} in Asia/Seoul`,
        received: post.date,
      })
    }

    if (post.updatedAt !== undefined && post.updatedAt < post.date) {
      issues.push({
        path: post.sourcePath,
        field: 'updatedAt',
        cause: 'must be the same as or later than date',
        received: post.updatedAt,
      })
    }
  }

  return issues
}

export const validateContent = (options: LoadContentOptions = {}): ValidationResult => {
  const contentDirectory = resolve(options.contentDirectory ?? getDefaultContentDirectory())
  const postsDirectory = join(contentDirectory, 'posts')
  const tagsPath = join(contentDirectory, 'tags.yml')
  const seriesPath = join(contentDirectory, 'series.yml')
  const issues: ContentIssue[] = []

  const tagResult = parseTagRegistry(tagsPath, displayPath(contentDirectory, tagsPath))
  const seriesResult = parseSeriesRegistry(seriesPath, displayPath(contentDirectory, seriesPath))

  if (!tagResult.success) {
    issues.push(...tagResult.issues)
  }
  if (!seriesResult.success) {
    issues.push(...seriesResult.issues)
  }

  let postFiles: string[] = []

  try {
    postFiles = discoverPostFiles(postsDirectory)
  } catch (error) {
    issues.push({
      path: displayPath(contentDirectory, postsDirectory),
      field: 'directory',
      cause: error instanceof Error ? error.message : 'could not discover Markdown files',
    })
  }

  const posts: Post[] = []

  for (const filePath of postFiles) {
    const result = parsePost(filePath, displayPath(contentDirectory, filePath))

    if (result.post !== undefined) {
      posts.push(result.post)
    }
    issues.push(...result.issues)
  }

  issues.push(
    ...validatePosts(
      posts,
      tagResult.success ? tagResult.definitions : undefined,
      seriesResult.success ? seriesResult.definitions : undefined,
      getSeoulDate(options.now ?? new Date()),
    ),
  )

  if (issues.length > 0 || !tagResult.success || !seriesResult.success) {
    return { success: false, issues: Object.freeze(issues) }
  }

  return {
    success: true,
    catalog: Object.freeze({
      posts: Object.freeze([...posts].sort(compareNewestFirst)),
      tags: tagResult.definitions,
      series: seriesResult.definitions,
    }),
  }
}

export const loadContent = (options: LoadContentOptions = {}): ContentCatalog => {
  const result = validateContent(options)

  if (!result.success) {
    throw new ContentValidationError(result.issues)
  }

  return result.catalog
}

export const getAllPosts = (content: ContentCatalog): readonly Post[] => content.posts

export const getPublishedPosts = (content: ContentCatalog): readonly Post[] =>
  Object.freeze(content.posts.filter(isPostVisible))

export const getPostBySlug = (content: ContentCatalog, slug: string): Post | undefined =>
  content.posts.find((post) => post.slug === slug && isPostVisible(post))

export const getPostsByTag = (content: ContentCatalog, tag: string): readonly Post[] =>
  Object.freeze(content.posts.filter((post) => isPostVisible(post) && post.tags.includes(tag)))

export const getSeriesPosts = (content: ContentCatalog, series: string): readonly Post[] =>
  Object.freeze(
    content.posts
      .filter((post) => isPostVisible(post) && post.series === series)
      .sort(compareOldestFirst),
  )

export const getTagDefinitions = (content: ContentCatalog): readonly TagDefinition[] => content.tags

export const getSeriesDefinitions = (content: ContentCatalog): readonly SeriesDefinition[] =>
  content.series
