import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/types"
import { cn } from "@/lib/utils"

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  saved: { label: "Saved", className: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  applied: { label: "Applied", className: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  interview: { label: "Interview", className: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  technical: { label: "Technical", className: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  offer: { label: "Offer", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  rejected: { label: "Rejected", className: "bg-red-500/15 text-red-400 border-red-500/20" },
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}