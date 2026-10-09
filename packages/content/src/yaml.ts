import { parseDocument } from 'yaml'

import type { ContentIssue } from './domain.ts'

interface YamlSuccess {
  readonly success: true
  readonly value: unknown
}

interface YamlFailure {
  readonly success: false
  readonly issues: readonly ContentIssue[]
}

export type YamlResult = YamlSuccess | YamlFailure

export const parseYaml = (source: string, sourcePath: string): YamlResult => {
  const document = parseDocument(source, {
    logLevel: 'silent',
    prettyErrors: true,
    strict: true,
    stringKeys: true,
    uniqueKeys: true,
  })

  if (document.errors.length > 0) {
    return {
      success: false,
      issues: document.errors.map((error) => ({
        path: sourcePath,
        field: 'yaml',
        cause: `${error.code}: ${error.message}`,
      })),
    }
  }

  return { success: true, value: document.toJS({ maxAliasCount: 100 }) }
}
