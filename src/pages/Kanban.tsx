import { toast } from "sonner"
import type { ApplicationStatus } from "@/types"
import { useApplications } from "@/hooks/useApplications"
import { PriorityBadge } from "@/components/applications/PriorityBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

const columns: { status: ApplicationStatus; label: string }[] = [
  { status: "saved", label: "Saved" },
  { status: "applied", label: "Applied" },
  { status: "interview", label: "Interview" },
  { status: "technical", label: "Technical Interview" },
  { status: "offer", label: "Offer" },
  { status: "rejected", label: "Rejected" },
]

export function Kanban() {
  const { applications, upsert } = useApplications()

  const moveCard = (appId: string, newStatus: ApplicationStatus) => {
    const app = applications.find((a) => a.id === appId)
    if (!app || app.status === newStatus) return
    upsert({ ...app, status: newStatus, updatedAt: new Date().toISOString() })
    toast.success(`Moved to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <p className="text-sm text-muted-foreground">Drag-style pipeline — use status dropdown on each card</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(({ status, label }) => {
          const cards = applications.filter((a) => a.status === status)
          return (
            <div key={status} className="w-72 shrink-0">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{label}</CardTitle>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{cards.length}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    <div className="space-y-2 p-1">
                      {cards.length === 0 ? (
                        <p className="py-8 text-center text-xs text-muted-foreground">No cards</p>
                      ) : (
                        cards.map((app) => (
                          <Card key={app.id} className="border-border/60 bg-card/80 shadow-sm transition-shadow hover:shadow-md">
                            <CardContent className="space-y-2 p-3">
                              <div>
                                <p className="font-medium text-sm">{app.company}</p>
                                <p className="text-xs text-muted-foreground">{app.role}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <PriorityBadge priority={app.priority} />
                                {app.cvMatchScore !== null && (
                                  <span className="text-xs text-muted-foreground">{app.cvMatchScore}% match</span>
                                )}
                              </div>
                              {app.location && (
                                <p className="text-xs text-muted-foreground">{app.location}</p>
                              )}
                              <Select
                                value={app.status}
                                onValueChange={(v) => moveCard(app.id, v as ApplicationStatus)}
                              >
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {columns.map((c) => (
                                    <SelectItem key={c.status} value={c.status}>{c.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}