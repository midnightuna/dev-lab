export type PostStatus = 'draft' | 'published'

export interface Post {
  readonly sourcePath: string
  readonly title: string
  readonly slug: string
  readonly status: PostStatus
  readonly date: string
  readonly updatedAt?: string
  readonly excerpt: string
  readonly tags: readonly string[]
  readonly series?: string
  readonly thumbnail?: string
  readonly body: string
}

export interface TagDefinition {
  readonly slug: string
  readonly label: string
}

export interface SeriesDefinition {
  readonly slug: string
  readonly label: string
}

export interface ContentCatalog {
  readonly posts: readonly Post[]
  readonly tags: readonly TagDefinition[]
  readonly series: readonly SeriesDefinition[]
}

export interface ContentIssue {
  readonly path: string
  readonly field: string
  readonly cause: string
  readonly received?: unknown
}

export interface LoadContentOptions {
  readonly contentDirectory?: string
  readonly now?: Date
}

export type ValidationResult =
  | { readonly success: true; readonly catalog: ContentCatalog }
  | { readonly success: false; readonly issues: readonly ContentIssue[] }
