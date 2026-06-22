import { getT } from "@/i18n/getT"

export function formatRelativeDate(date: string | null): string {
  if (!date) return "—"
  const t = getT()
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
  if (days < 0) return t("common.daysAgo", { n: Math.abs(days) })
  if (days === 0) return t("common.today")
  if (days === 1) return t("common.tomorrow")
  return t("common.inDays", { n: days })
}