import { Badge } from "@/components/ui/badge"
import type { ApplicationPriority } from "@/types"
import { cn } from "@/lib/utils"

const priorityConfig: Record<
  ApplicationPriority,
  { label: string; className: string }
> = {
  low: { label: "Low", className: "bg-slate-500/10 text-slate-400" },
  medium: { label: "Medium", className: "bg-amber-500/10 text-amber-400" },
  high: { label: "High", className: "bg-red-500/10 text-red-400" },
}

export function PriorityBadge({ priority }: { priority: ApplicationPriority }) {
  const config = priorityConfig[priority]
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}