import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Plus,
  ScanSearch,
  Target,
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
import { useAuth } from "@/contexts/AuthContext"
import { useI18n } from "@/contexts/I18nContext"
import { useApplications } from "@/hooks/useApplications"
import { getSettings } from "@/lib/storage"
import { RemindersPanel } from "@/components/dashboard/RemindersPanel"
import { StatusBadge } from "@/components/applications/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function Dashboard() {
  const { applications } = useApplications()
  const { user } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()

  const weeklyGoal = user ? getSettings(user.id).weeklyApplicationGoal : 5

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

    const statusKeys = ["saved", "applied", "interview", "technical", "offer", "rejected"] as const
    const statusCounts = statusKeys.map((key) => ({
      name: t(`status.${key}`),
      count: applications.filter((a) => a.status === key).length,
    }))

    const weekStart = new Date()
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weeklyApplied = applications.filter((a) => {
      if (!a.dateApplied) return false
      return new Date(a.dateApplied) >= weekStart
    }).length

    return { applied, interviews, offers, rejected, avgScore, statusCounts, weeklyApplied }
  }, [applications, t])

  const recent = applications.slice(0, 5)
  const upcoming = applications
    .filter((a) => ["interview", "technical"].includes(a.status))
    .slice(0, 3)

  const statCards = [
    { label: t("dashboard.total"), value: applications.length, icon: Briefcase, color: "text-primary" },
    { label: t("dashboard.applied"), value: stats.applied, icon: TrendingUp, color: "text-blue-400" },
    { label: t("dashboard.interviews"), value: stats.interviews, icon: Calendar, color: "text-violet-400" },
    { label: t("dashboard.offers"), value: stats.offers, icon: CheckCircle2, color: "text-emerald-400" },
    { label: t("dashboard.rejected"), value: stats.rejected, icon: XCircle, color: "text-red-400" },
    { label: t("dashboard.avgMatch"), value: `${stats.avgScore}%`, icon: ScanSearch, color: "text-amber-400" },
  ]

  const goalProgress = weeklyGoal > 0 ? Math.min(100, (stats.weeklyApplied / weeklyGoal) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/app/cv-analyzer")}>
            <ScanSearch className="mr-2 size-4" /> {t("dashboard.analyzeCv")}
          </Button>
          <Button onClick={() => navigate("/app/applications?action=new")}>
            <Plus className="mr-2 size-4" /> {t("nav.newApplication")}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Target className="size-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{t("dashboard.weeklyGoal")}</p>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.weeklyGoalDesc", { current: stats.weeklyApplied, goal: weeklyGoal })}
            </p>
            <Progress value={goalProgress} className="mt-2 h-2" />
            {stats.weeklyApplied >= weeklyGoal && weeklyGoal > 0 && (
              <p className="mt-1 text-xs text-emerald-400">{t("dashboard.goalReached")}</p>
            )}
          </div>
        </CardContent>
      </Card>

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

      <RemindersPanel applications={applications} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.byStatus")}</CardTitle>
            <CardDescription>{t("dashboard.byStatusDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t("common.noData")}</p>
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
            <CardTitle>{t("dashboard.upcomingInterviews")}</CardTitle>
            <CardDescription>{t("dashboard.upcomingDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t("dashboard.noInterviews")}</p>
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
          <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
          <CardDescription>{t("dashboard.recentDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="py-12 text-center">
              <Briefcase className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">{t("dashboard.noActivity")}</p>
              <Button className="mt-4" onClick={() => navigate("/app/applications?action=new")}>
                {t("dashboard.addFirst")}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((app) => (
                <div key={app.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium">{app.company} — {app.role}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(app.updatedAt).toLocaleDateString()}
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