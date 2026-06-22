import { Badge } from "@/components/ui/badge"
import type { ApplicationPriority } from "@/types"
import { useI18n } from "@/contexts/I18nContext"
import { cn } from "@/lib/utils"

const priorityClass: Record<ApplicationPriority, string> = {
  low: "bg-slate-500/10 text-slate-400",
  medium: "bg-amber-500/10 text-amber-400",
  high: "bg-red-500/10 text-red-400",
}

export function PriorityBadge({ priority }: { priority: ApplicationPriority }) {
  const { t } = useI18n()
  return (
    <Badge variant="secondary" className={cn("font-medium", priorityClass[priority])}>
      {t(`priority.${priority}`)}
    </Badge>
  )
}