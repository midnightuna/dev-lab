const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'long',
  timeZone: 'UTC',
})

export function formatPostDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`))
}
