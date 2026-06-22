import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Copy, Download, Pencil, Plus, ScanSearch, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Application, ApplicationPriority, ApplicationStatus } from "@/types"
import { duplicateApplication, exportApplicationsCsv } from "@/lib/applications"
import { useApplications } from "@/hooks/useApplications"
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
    toast.success("Application deleted")
  }

  const handleDuplicate = (app: Application) => {
    upsert(duplicateApplication(app))
    toast.success("Application duplicated")
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
    toast.success("CSV exported")
  }

  const handleAnalyze = (app: Application) => {
    const params = new URLSearchParams()
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
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-sm text-muted-foreground">{applications.length} total applications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCsv} disabled={filtered.length === 0}>
            <Download className="mr-2 size-4" /> Export CSV
          </Button>
          <Button onClick={() => { setEditing(null); setDialogOpen(true) }}>
            <Plus className="mr-2 size-4" /> Add Application
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {(["saved","applied","interview","technical","offer","rejected"] as ApplicationStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {(["low","medium","high"] as ApplicationPriority[]).map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as "date" | "company")}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="company">Sort by Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No applications found</p>
              <Button className="mt-4" onClick={() => { setEditing(null); setDialogOpen(true) }}>
                Add your first application
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>CV Match</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                          {app.jobDescription && (
                            <Button variant="ghost" size="icon-sm" title="Analyze CV" onClick={() => handleAnalyze(app)}>
                              <ScanSearch className="size-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon-sm" title="Duplicate" onClick={() => handleDuplicate(app)}>
                            <Copy className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" title="Edit" onClick={() => { setEditing(app); setDialogOpen(true) }}>
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" className="text-destructive" title="Delete" onClick={() => handleDelete(app.id)}>
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
          toast.success(editing ? "Application updated" : "Application added")
        }}
      />
    </div>
  )
}