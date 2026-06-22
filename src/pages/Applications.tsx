import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Copy, Download, ExternalLink, Pencil, Plus, ScanSearch, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Application, ApplicationPriority, ApplicationStatus } from "@/types"
import { duplicateApplication, exportApplicationsCsv } from "@/lib/applications"
import { useApplications } from "@/hooks/useApplications"
import { useI18n } from "@/contexts/I18nContext"
import { ApplicationFormDialog } from "@/components/applications/ApplicationFormDialog"
import { PriorityBadge } from "@/components/applications/PriorityBadge"
import { StatusBadge } from "@/components/applications/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function Applications() {
  const { applications, upsert, remove } = useApplications()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "company">("date")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setEditing(null)
      setDialogOpen(true)
      searchParams.delete("action")
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const filtered = useMemo(() => {
    let result = [...applications]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter)
    }
    if (priorityFilter !== "all") {
      result = result.filter((a) => a.priority === priorityFilter)
    }
    result.sort((a, b) => {
      if (sortBy === "company") return a.company.localeCompare(b.company)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
    return result
  }, [applications, search, statusFilter, priorityFilter, sortBy])

  const handleDelete = (id: string) => {
    remove(id)
    toast.success(t("applications.deleted"))
  }

  const handleDuplicate = (app: Application) => {
    upsert(duplicateApplication(app))
    toast.success(t("applications.duplicated"))
  }

  const handleExportCsv = () => {
    const csv = exportApplicationsCsv(filtered)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `applypilot-applications-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(t("applications.csvExported"))
  }

  const handleAnalyze = (app: Application) => {
    const params = new URLSearchParams()
    params.set("appId", app.id)
    if (app.company) params.set("company", app.company)
    if (app.jobDescription) params.set("job", app.jobDescription.slice(0, 2000))
    navigate(`/app/cv-analyzer?${params.toString()}`)
  }

  const formatSalary = (app: Application) => {
    if (!app.salaryMin && !app.salaryMax) return "—"
    const min = app.salaryMin ? `$${(app.salaryMin / 1000).toFixed(0)}k` : ""
    const max = app.salaryMax ? `$${(app.salaryMax / 1000).toFixed(0)}k` : ""
    return min && max ? `${min}–${max}` : min || max
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("applications.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("applications.total", { n: applications.length })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCsv} disabled={filtered.length === 0}>
            <Download className="mr-2 size-4" /> {t("applications.exportCsv")}
          </Button>
          <Button onClick={() => { setEditing(null); setDialogOpen(true) }}>
            <Plus className="mr-2 size-4" /> {t("applications.add")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("common.search")} className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder={t("applications.status")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("applications.allStatus")}</SelectItem>
                {(["saved","applied","interview","technical","offer","rejected"] as ApplicationStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{t(`status.${s}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder={t("applications.priority")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("applications.allPriority")}</SelectItem>
                {(["low","medium","high"] as ApplicationPriority[]).map((p) => (
                  <SelectItem key={p} value={p}>{t(`priority.${p}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as "date" | "company")}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date">{t("applications.sortDate")}</SelectItem>
                <SelectItem value="company">{t("applications.sortCompany")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">{t("applications.empty")}</p>
              <Button className="mt-4" onClick={() => { setEditing(null); setDialogOpen(true) }}>
                {t("applications.addFirst")}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("applications.company")}</TableHead>
                    <TableHead>{t("applications.role")}</TableHead>
                    <TableHead>{t("applications.status")}</TableHead>
                    <TableHead>{t("applications.priority")}</TableHead>
                    <TableHead>{t("applications.salary")}</TableHead>
                    <TableHead>{t("applications.location")}</TableHead>
                    <TableHead>{t("applications.cvMatch")}</TableHead>
                    <TableHead className="text-right">{t("applications.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.company}</TableCell>
                      <TableCell>{app.role}</TableCell>
                      <TableCell><StatusBadge status={app.status} /></TableCell>
                      <TableCell><PriorityBadge priority={app.priority} /></TableCell>
                      <TableCell>{formatSalary(app)}</TableCell>
                      <TableCell>{app.location || "—"}</TableCell>
                      <TableCell>{app.cvMatchScore !== null ? `${app.cvMatchScore}%` : "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {app.jobUrl && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title={t("common.openUrl")}
                              onClick={() => window.open(app.jobUrl, "_blank", "noopener,noreferrer")}
                            >
                              <ExternalLink className="size-3.5" />
                            </Button>
                          )}
                          {app.jobDescription && (
                            <Button variant="ghost" size="icon-sm" title={t("common.analyzeCv")} onClick={() => handleAnalyze(app)}>
                              <ScanSearch className="size-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon-sm" title={t("common.duplicate")} onClick={() => handleDuplicate(app)}>
                            <Copy className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" title={t("common.edit")} onClick={() => { setEditing(app); setDialogOpen(true) }}>
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" className="text-destructive" title={t("common.delete")} onClick={() => handleDelete(app.id)}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ApplicationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        application={editing}
        onSave={(app) => {
          upsert(app)
          toast.success(editing ? t("applications.updated") : t("applications.added"))
        }}
      />
    </div>
  )
}