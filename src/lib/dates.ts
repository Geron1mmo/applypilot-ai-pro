export function formatRelativeDate(date: string | null): string {
  if (!date) return "—"
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
  if (days < 0) return `${Math.abs(days)}d ago`
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  return `In ${days}d`
}