import { z } from 'zod'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const datePattern = /^\d{4}-\d{2}-\d{2}$/

const isCalendarDate = (value: string): boolean => {
  if (!datePattern.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

const optionalText = (schema: z.ZodString) =>
  z.preprocess((value) => (value === null || value === '' ? undefined : value), schema.optional())

export const slugSchema = z.string().trim().regex(slugPattern, 'must be lowercase kebab-case')

export const dateSchema = z
  .string()
  .regex(datePattern, 'must use YYYY-MM-DD')
  .refine(isCalendarDate, 'must be a valid calendar date')

export const postFrontmatterSchema = z
  .object({
    title: z.string().trim().min(1, 'must not be empty'),
    slug: slugSchema,
    status: z.enum(['draft', 'published']),
    date: dateSchema,
    updatedAt: optionalText(dateSchema),
    excerpt: optionalText(
      z
        .string()
        .trim()
        .min(1, 'must not be empty')
        .refine((value) => !/[\r\n]/.test(value), 'must be a single line'),
    ),
    tags: z.array(slugSchema).min(1, 'must contain at least one tag'),
    series: optionalText(slugSchema),
    thumbnail: optionalText(
      z
        .string()
        .trim()
        .regex(/^\/(?!\/)[^?#\\]+$/, 'must be a root-relative public asset path'),
    ),
  })
  .strict()

export const registrySchema = z.record(
  slugSchema,
  z
    .object({
      label: z.string().trim().min(1, 'must not be empty'),
    })
    .strict(),
)

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>
