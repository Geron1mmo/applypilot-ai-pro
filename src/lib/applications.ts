import type { Application } from "@/types"

export function normalizeApplication(app: Application): Application {
  return {
    ...app,
    interviewDate: app.interviewDate ?? null,
    followUpDate: app.followUpDate ?? null,
    statusHistory: app.statusHistory ?? [],
  }
}

export function buildApplicationUpdate(
  existing: Application | null | undefined,
  data: Application,
  now = new Date().toISOString()
): Application {
  const history = [...(existing?.statusHistory ?? data.statusHistory ?? [])]
  if (!existing) {
    history.push({ status: data.status, changedAt: now })
  } else if (existing.status !== data.status) {
    history.push({ status: data.status, changedAt: now })
  }

  return normalizeApplication({
    ...data,
    statusHistory: history,
    createdAt: existing?.createdAt ?? data.createdAt ?? now,
    updatedAt: now,
  })
}

export function duplicateApplication(app: Application): Application {
  const now = new Date().toISOString()
  return normalizeApplication({
    ...app,
    id: crypto.randomUUID(),
    company: `${app.company} (copy)`,
    status: "saved",
    dateApplied: null,
    interviewDate: null,
    followUpDate: null,
    cvMatchScore: null,
    statusHistory: [{ status: "saved", changedAt: now }],
    createdAt: now,
    updatedAt: now,
  })
}

export function exportApplicationsCsv(applications: Application[]): string {
  const headers = [
    "Company",
    "Role",
    "Status",
    "Priority",
    "Location",
    "Work Mode",
    "Salary Min",
    "Salary Max",
    "Date Applied",
    "Interview Date",
    "Follow-up Date",
    "Deadline",
    "CV Match %",
    "Job URL",
    "HR Name",
    "HR Email",
  ]
  const escape = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v)
    return `"${s.replace(/"/g, '""')}"`
  }
  const rows = applications.map((a) =>
    [
      a.company,
      a.role,
      a.status,
      a.priority,
      a.location,
      a.workMode,
      a.salaryMin,
      a.salaryMax,
      a.dateApplied?.split("T")[0] ?? "",
      a.interviewDate?.split("T")[0] ?? "",
      a.followUpDate?.split("T")[0] ?? "",
      a.deadline?.split("T")[0] ?? "",
      a.cvMatchScore ?? "",
      a.jobUrl,
      a.hrName,
      a.hrEmail,
    ]
      .map(escape)
      .join(",")
  )
  return [headers.join(","), ...rows].join("\n")
}

export function getUpcomingReminders(
  applications: Application[],
  withinDays = 14
): {
  deadlines: Application[]
  followUps: Application[]
  interviews: Application[]
} {
  const now = new Date()
  const limit = new Date(now.getTime() + withinDays * 86400000)

  const inRange = (date: string | null) => {
    if (!date) return false
    const d = new Date(date)
    return d >= now && d <= limit
  }

  return {
    deadlines: applications
      .filter((a) => inRange(a.deadline) && a.status !== "rejected")
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()),
    followUps: applications
      .filter((a) => inRange(a.followUpDate) && !["offer", "rejected"].includes(a.status))
      .sort((a, b) => new Date(a.followUpDate!).getTime() - new Date(b.followUpDate!).getTime()),
    interviews: applications
      .filter((a) => inRange(a.interviewDate))
      .sort((a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime()),
  }
}

export function daysUntil(date: string | null): number | null {
  if (!date) return null
  const diff = new Date(date).getTime() - Date.now()
  return Math.ceil(diff / 86400000)
}