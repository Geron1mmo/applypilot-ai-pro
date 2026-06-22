import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { AlarmClock, Calendar, MessageSquare } from "lucide-react"
import type { Application } from "@/types"
import { getUpcomingReminders } from "@/lib/applications"
import { formatRelativeDate } from "@/lib/dates"
import { StatusBadge } from "@/components/applications/StatusBadge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function ReminderList({
  items,
  dateKey,
  empty,
}: {
  items: Application[]
  dateKey: "deadline" | "followUpDate" | "interviewDate"
  empty: string
}) {
  if (items.length === 0) {
    return <p className="py-4 text-center text-xs text-muted-foreground">{empty}</p>
  }
  return (
    <div className="space-y-2">
      {items.slice(0, 4).map((app) => (
        <div
          key={app.id}
          className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{app.company}</p>
            <p className="truncate text-xs text-muted-foreground">{app.role}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="text-xs text-primary">{formatRelativeDate(app[dateKey])}</span>
            <StatusBadge status={app.status} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function RemindersPanel({ applications }: { applications: Application[] }) {
  const navigate = useNavigate()
  const reminders = useMemo(() => getUpcomingReminders(applications), [applications])
  const total =
    reminders.deadlines.length +
    reminders.followUps.length +
    reminders.interviews.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlarmClock className="size-4 text-primary" />
          Upcoming Reminders
        </CardTitle>
        <CardDescription>
          {total > 0
            ? `${total} item${total === 1 ? "" : "s"} in the next 14 days`
            : "No upcoming deadlines or follow-ups"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="size-3.5" /> Deadlines
          </p>
          <ReminderList items={reminders.deadlines} dateKey="deadline" empty="None" />
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MessageSquare className="size-3.5" /> Follow-ups
          </p>
          <ReminderList items={reminders.followUps} dateKey="followUpDate" empty="None" />
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="size-3.5" /> Interviews
          </p>
          <ReminderList items={reminders.interviews} dateKey="interviewDate" empty="None" />
        </div>
      </CardContent>
      {total > 0 && (
        <div className="px-6 pb-4">
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => navigate("/app/applications")}
          >
            View all applications →
          </button>
        </div>
      )}
    </Card>
  )
}