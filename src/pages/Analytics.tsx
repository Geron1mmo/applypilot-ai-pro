import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useI18n } from "@/contexts/I18nContext"
import { useApplications } from "@/hooks/useApplications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ApplicationStatus } from "@/types"

const COLORS = ["#6366f1", "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"]

const STATUS_KEYS: ApplicationStatus[] = [
  "saved",
  "applied",
  "interview",
  "technical",
  "offer",
  "rejected",
]

export function Analytics() {
  const { t } = useI18n()
  const { applications } = useApplications()

  const metrics = useMemo(() => {
    const total = applications.length
    const applied = applications.filter((a) => a.status !== "saved").length
    const interviews = applications.filter((a) =>
      ["interview", "technical", "offer"].includes(a.status)
    ).length
    const offers = applications.filter((a) => a.status === "offer").length
    const rejected = applications.filter((a) => a.status === "rejected").length

    const interviewRate = applied > 0 ? Math.round((interviews / applied) * 100) : 0
    const offerRate = applied > 0 ? Math.round((offers / applied) * 100) : 0
    const rejectionRate = applied > 0 ? Math.round((rejected / applied) * 100) : 0

    const salaries = applications
      .filter((a) => a.salaryMin && a.salaryMax)
      .map((a) => ((a.salaryMin! + a.salaryMax!) / 2))
    const avgSalary = salaries.length
      ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
      : 0

    const scores = applications
      .map((a) => a.cvMatchScore)
      .filter((s): s is number => s !== null)
    const bestScore = scores.length ? Math.max(...scores) : 0

    const statusData = STATUS_KEYS.map((key) => ({
      name: t(`status.${key}`),
      value: applications.filter((a) => a.status === key).length,
    })).filter((d) => d.value > 0)

    const monthlyMap = new Map<string, number>()
    applications.forEach((a) => {
      if (a.dateApplied) {
        const month = a.dateApplied.slice(0, 7)
        monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + 1)
      }
    })
    const timelineData = [...monthlyMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }))

    return {
      total, interviewRate, offerRate, rejectionRate, avgSalary, bestScore,
      statusData, timelineData,
    }
  }, [applications, t])

  const statCards = [
    { label: t("analytics.interviewRate"), value: `${metrics.interviewRate}%` },
    { label: t("analytics.offerRate"), value: `${metrics.offerRate}%` },
    { label: t("analytics.rejectionRate"), value: `${metrics.rejectionRate}%` },
    { label: t("analytics.avgSalary"), value: metrics.avgSalary ? `$${(metrics.avgSalary / 1000).toFixed(0)}k` : "—" },
    { label: t("analytics.bestMatch"), value: metrics.bestScore ? `${metrics.bestScore}%` : "—" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("analytics.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("analytics.subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("analytics.byStatus")}</CardTitle>
            <CardDescription>{t("analytics.byStatusDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.statusData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">{t("common.noData")}</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={metrics.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {metrics.statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("analytics.overTime")}</CardTitle>
            <CardDescription>{t("analytics.overTimeDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.timelineData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">{t("common.noData")}</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={metrics.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 10%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("analytics.distribution")}</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.statusData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("common.noData")}</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={metrics.statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 10%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}