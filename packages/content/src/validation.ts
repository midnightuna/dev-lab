import type { ContentIssue } from './domain.ts'

const formatReceived = (value: unknown): string => {
  if (typeof value === 'string') {
    return JSON.stringify(value)
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export const formatContentIssues = (issues: readonly ContentIssue[]): string =>
  issues
    .map((issue) => {
      const received =
        issue.received === undefined ? '' : `; received ${formatReceived(issue.received)}`
      return `${issue.path}: ${issue.field}: ${issue.cause}${received}`
    })
    .join('\n')

export class ContentValidationError extends Error {
  readonly issues: readonly ContentIssue[]

  constructor(issues: readonly ContentIssue[]) {
    super(`Content validation failed:\n${formatContentIssues(issues)}`)
    this.name = 'ContentValidationError'
    this.issues = issues
  }
}
