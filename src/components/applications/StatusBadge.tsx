import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/types"
import { useI18n } from "@/contexts/I18nContext"
import { cn } from "@/lib/utils"

const statusClass: Record<ApplicationStatus, string> = {
  saved: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  applied: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  interview: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  technical: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  offer: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/15 text-red-400 border-red-500/20",
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { t } = useI18n()
  return (
    <Badge variant="outline" className={cn("font-medium", statusClass[status])}>
      {t(`status.${status}`)}
    </Badge>
  )
}