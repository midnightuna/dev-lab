import { resolve } from 'node:path'

import {
  getPostBySlug as findPostBySlug,
  getPublishedPosts as selectPublishedPosts,
  getSeriesDefinitions,
  getSeriesPosts as selectSeriesPosts,
  getTagDefinitions,
  loadContent,
} from '@dev-lab/content'

const content = loadContent({ contentDirectory: resolve(process.cwd(), '../../content') })
const tagsBySlug = new Map(getTagDefinitions(content).map((tag) => [tag.slug, tag.label]))
const seriesBySlug = new Map(
  getSeriesDefinitions(content).map((series) => [series.slug, series.label]),
)

function getRegisteredLabel(registry: ReadonlyMap<string, string>, kind: string, slug: string) {
  const label = registry.get(slug)

  if (label === undefined) {
    throw new Error(`Expected a registered ${kind} label. Received slug: ${JSON.stringify(slug)}`)
  }

  return label
}

export const getPublishedPosts = () => selectPublishedPosts(content)

export const getPostBySlug = (slug: string) => findPostBySlug(content, slug)

export const getSeriesPosts = (series: string) => selectSeriesPosts(content, series)

export const getTagLabel = (slug: string) => getRegisteredLabel(tagsBySlug, 'tag', slug)

export const getSeriesLabel = (slug: string) => getRegisteredLabel(seriesBySlug, 'series', slug)
