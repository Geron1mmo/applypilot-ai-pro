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
import { useApplications } from "@/hooks/useApplications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = ["#6366f1", "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"]

export function Analytics() {
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

    const statusData = [
      { name: "Saved", value: applications.filter((a) => a.status === "saved").length },
      { name: "Applied", value: applications.filter((a) => a.status === "applied").length },
      { name: "Interview", value: applications.filter((a) => a.status === "interview").length },
      { name: "Technical", value: applications.filter((a) => a.status === "technical").length },
      { name: "Offer", value: applications.filter((a) => a.status === "offer").length },
      { name: "Rejected", value: applications.filter((a) => a.status === "rejected").length },
    ].filter((d) => d.value > 0)

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
  }, [applications])

  const statCards = [
    { label: "Interview Rate", value: `${metrics.interviewRate}%` },
    { label: "Offer Rate", value: `${metrics.offerRate}%` },
    { label: "Rejection Rate", value: `${metrics.rejectionRate}%` },
    { label: "Avg Salary", value: metrics.avgSalary ? `$${(metrics.avgSalary / 1000).toFixed(0)}k` : "—" },
    { label: "Best CV Match", value: metrics.bestScore ? `${metrics.bestScore}%` : "—" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Insights into your job search performance</p>
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
            <CardTitle>Applications by Status</CardTitle>
            <CardDescription>Current pipeline breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.statusData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No data yet</p>
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
            <CardTitle>Applications Over Time</CardTitle>
            <CardDescription>Monthly application volume</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.timelineData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No timeline data yet</p>
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
          <CardTitle>Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.statusData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No data</p>
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