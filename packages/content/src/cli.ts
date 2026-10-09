import { resolve } from 'node:path'

import { validateContent } from './repository.ts'
import { formatContentIssues } from './validation.ts'

const getContentDirectory = (arguments_: readonly string[]): string | undefined => {
  const optionIndex = arguments_.indexOf('--content-dir')

  if (optionIndex === -1) {
    return undefined
  }

  const value = arguments_[optionIndex + 1]

  if (value === undefined) {
    throw new Error('--content-dir requires a path')
  }

  return resolve(value)
}

try {
  const result = validateContent({ contentDirectory: getContentDirectory(process.argv.slice(2)) })

  if (result.success) {
    console.log(
      `Validated ${result.catalog.posts.length} posts, ${result.catalog.tags.length} tags, and ${result.catalog.series.length} series.`,
    )
  } else {
    console.error(formatContentIssues(result.issues))
    process.exitCode = 1
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Content validation failed unexpectedly')
  process.exitCode = 1
}
