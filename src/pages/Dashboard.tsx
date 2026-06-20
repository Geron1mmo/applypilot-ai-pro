import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Plus,
  ScanSearch,
  TrendingUp,
  XCircle,
} from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useApplications } from "@/hooks/useApplications"
import { StatusBadge } from "@/components/applications/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Dashboard() {
  const { applications } = useApplications()
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const applied = applications.filter((a) => a.status !== "saved").length
    const interviews = applications.filter((a) =>
      ["interview", "technical"].includes(a.status)
    ).length
    const offers = applications.filter((a) => a.status === "offer").length
    const rejected = applications.filter((a) => a.status === "rejected").length
    const scores = applications
      .map((a) => a.cvMatchScore)
      .filter((s): s is number => s !== null)
    const avgScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0

    const statusCounts = [
      { name: "Saved", count: applications.filter((a) => a.status === "saved").length },
      { name: "Applied", count: applications.filter((a) => a.status === "applied").length },
      { name: "Interview", count: applications.filter((a) => a.status === "interview").length },
      { name: "Technical", count: applications.filter((a) => a.status === "technical").length },
      { name: "Offer", count: applications.filter((a) => a.status === "offer").length },
      { name: "Rejected", count: applications.filter((a) => a.status === "rejected").length },
    ]

    return { applied, interviews, offers, rejected, avgScore, statusCounts }
  }, [applications])

  const recent = applications.slice(0, 5)
  const upcoming = applications
    .filter((a) => ["interview", "technical"].includes(a.status))
    .slice(0, 3)

  const statCards = [
    { label: "Total", value: applications.length, icon: Briefcase, color: "text-primary" },
    { label: "Applied", value: stats.applied, icon: TrendingUp, color: "text-blue-400" },
    { label: "Interviews", value: stats.interviews, icon: Calendar, color: "text-violet-400" },
    { label: "Offers", value: stats.offers, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-400" },
    { label: "Avg CV Match", value: `${stats.avgScore}%`, icon: ScanSearch, color: "text-amber-400" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your job search</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/app/cv-analyzer")}>
            <ScanSearch className="mr-2 size-4" /> Analyze CV
          </Button>
          <Button onClick={() => navigate("/app/applications?action=new")}>
            <Plus className="mr-2 size-4" /> New Application
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-lg bg-muted p-2 ${color}`}>
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Applications by Status</CardTitle>
            <CardDescription>Pipeline distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No applications yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.statusCounts}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="oklch(0.65 0.18 250)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>Active interview stages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No upcoming interviews</p>
            ) : (
              upcoming.map((app) => (
                <div key={app.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium">{app.company}</p>
                    <p className="text-sm text-muted-foreground">{app.role}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest application updates</CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="py-12 text-center">
              <Briefcase className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">No activity yet. Add your first application!</p>
              <Button className="mt-4" onClick={() => navigate("/app/applications?action=new")}>
                Add Application
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((app) => (
                <div key={app.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium">{app.company} — {app.role}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(app.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}