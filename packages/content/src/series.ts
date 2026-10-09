import { readFileSync } from 'node:fs'

import type { ContentIssue, SeriesDefinition } from './domain.ts'
import { registrySchema } from './schema.ts'
import { parseYaml } from './yaml.ts'

interface SeriesRegistrySuccess {
  readonly success: true
  readonly definitions: readonly SeriesDefinition[]
}

interface SeriesRegistryFailure {
  readonly success: false
  readonly issues: readonly ContentIssue[]
}

export type SeriesRegistryResult = SeriesRegistrySuccess | SeriesRegistryFailure

export const parseSeriesRegistry = (filePath: string, sourcePath: string): SeriesRegistryResult => {
  let source: string

  try {
    source = readFileSync(filePath, 'utf8')
  } catch (error) {
    return {
      success: false,
      issues: [
        {
          path: sourcePath,
          field: 'file',
          cause: error instanceof Error ? error.message : 'could not read file',
        },
      ],
    }
  }

  const yamlResult = parseYaml(source, sourcePath)

  if (!yamlResult.success) {
    return yamlResult
  }

  const result = registrySchema.safeParse(yamlResult.value)

  if (!result.success) {
    return {
      success: false,
      issues: result.error.issues.map((issue) => ({
        path: sourcePath,
        field: issue.path.length > 0 ? issue.path.join('.') : 'registry',
        cause: issue.message,
      })),
    }
  }

  return {
    success: true,
    definitions: Object.freeze(
      Object.entries(result.data)
        .map(([slug, definition]) => Object.freeze({ slug, label: definition.label }))
        .sort((left, right) => left.slug.localeCompare(right.slug)),
    ),
  }
}
