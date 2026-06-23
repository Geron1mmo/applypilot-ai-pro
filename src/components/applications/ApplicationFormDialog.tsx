import { useState } from "react"
import type { Application, ApplicationStatus, ApplicationPriority, WorkMode } from "@/types"
import { buildApplicationUpdate } from "@/lib/applications"
import { applicationSchema } from "@/lib/validation"
import { useAuth } from "@/contexts/AuthContext"
import { useI18n } from "@/contexts/I18nContext"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  application?: Application | null
  onSave: (app: Application) => void
}

const emptyForm = {
  company: "",
  role: "",
  location: "",
  workMode: "remote" as WorkMode,
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  jobUrl: "",
  hrName: "",
  hrEmail: "",
  status: "saved" as ApplicationStatus,
  priority: "medium" as ApplicationPriority,
  deadline: "",
  dateApplied: "",
  interviewDate: "",
  followUpDate: "",
  notes: "",
  jobDescription: "",
}

function getFormFromApplication(application?: Application | null) {
  if (!application) return emptyForm
  return {
    company: application.company,
    role: application.role,
    location: application.location,
    workMode: application.workMode,
    salaryMin: application.salaryMin?.toString() ?? "",
    salaryMax: application.salaryMax?.toString() ?? "",
    currency: application.currency,
    jobUrl: application.jobUrl,
    hrName: application.hrName,
    hrEmail: application.hrEmail,
    status: application.status,
    priority: application.priority,
    deadline: application.deadline?.split("T")[0] ?? "",
    dateApplied: application.dateApplied?.split("T")[0] ?? "",
    interviewDate: application.interviewDate?.split("T")[0] ?? "",
    followUpDate: application.followUpDate?.split("T")[0] ?? "",
    notes: application.notes,
    jobDescription: application.jobDescription,
  }
}

export function ApplicationFormDialog({
  open,
  onOpenChange,
  application,
  onSave,
}: Props) {
  const { user } = useAuth()
  const { t } = useI18n()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState(() => getFormFromApplication(application))
  const formKey = `${open}-${application?.id ?? "new"}`
  const [trackedFormKey, setTrackedFormKey] = useState(formKey)

  if (formKey !== trackedFormKey) {
    setTrackedFormKey(formKey)
    if (open) {
      setForm(getFormFromApplication(application))
      setErrors({})
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = applicationSchema.safeParse({
      ...form,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      deadline: form.deadline || null,
      dateApplied: form.dateApplied || null,
      interviewDate: form.interviewDate || null,
      followUpDate: form.followUpDate || null,
    })
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() ?? "form"
        fieldErrors[key] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    if (!user) return

    const draft: Application = {
      id: application?.id ?? crypto.randomUUID(),
      userId: user.id,
      company: parsed.data.company,
      role: parsed.data.role,
      location: parsed.data.location,
      workMode: parsed.data.workMode,
      salaryMin: parsed.data.salaryMin ?? null,
      salaryMax: parsed.data.salaryMax ?? null,
      currency: parsed.data.currency,
      jobUrl: parsed.data.jobUrl,
      hrName: parsed.data.hrName,
      hrEmail: parsed.data.hrEmail,
      status: parsed.data.status,
      priority: parsed.data.priority,
      deadline: parsed.data.deadline ?? null,
      dateApplied: parsed.data.dateApplied ?? null,
      interviewDate: parsed.data.interviewDate ?? null,
      followUpDate: parsed.data.followUpDate ?? null,
      notes: parsed.data.notes,
      jobDescription: parsed.data.jobDescription,
      cvMatchScore: application?.cvMatchScore ?? null,
      statusHistory: application?.statusHistory ?? [],
      createdAt: application?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onSave(buildApplicationUpdate(application, draft))
    onOpenChange(false)
  }

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {application ? t("applications.edit") : t("applications.new")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{t("applications.company")} *</Label>
              <Input value={form.company} onChange={(e) => set("company", e.target.value)} />
              {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.role")} *</Label>
              <Input value={form.role} onChange={(e) => set("role", e.target.value)} />
              {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.location")}</Label>
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.workMode")}</Label>
              <Select value={form.workMode} onValueChange={(v) => set("workMode", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["remote", "hybrid", "onsite"] as const).map((m) => (
                    <SelectItem key={m} value={m}>{t(`workMode.${m}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.salaryMin")}</Label>
              <Input type="number" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.salaryMax")}</Label>
              <Input type="number" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.status")}</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["saved","applied","interview","technical","offer","rejected"] as const).map((s) => (
                    <SelectItem key={s} value={s}>{t(`status.${s}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.priority")}</Label>
              <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["low", "medium", "high"] as const).map((p) => (
                    <SelectItem key={p} value={p}>{t(`priority.${p}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.jobUrl")}</Label>
              <Input value={form.jobUrl} onChange={(e) => set("jobUrl", e.target.value)} placeholder="https://" />
              {errors.jobUrl && <p className="text-xs text-destructive">{errors.jobUrl}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.hrEmail")}</Label>
              <Input value={form.hrEmail} onChange={(e) => set("hrEmail", e.target.value)} />
              {errors.hrEmail && <p className="text-xs text-destructive">{errors.hrEmail}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.hrContact")}</Label>
              <Input value={form.hrName} onChange={(e) => set("hrName", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.deadline")}</Label>
              <Input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.dateApplied")}</Label>
              <Input type="date" value={form.dateApplied} onChange={(e) => set("dateApplied", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.interviewDate")}</Label>
              <Input type="date" value={form.interviewDate} onChange={(e) => set("interviewDate", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("applications.followUpDate")}</Label>
              <Input type="date" value={form.followUpDate} onChange={(e) => set("followUpDate", e.target.value)} />
            </div>
          </div>
          {application && application.statusHistory.length > 0 && (
            <div className="space-y-1.5">
              <Label>{t("applications.statusHistory")}</Label>
              <div className="rounded-lg border border-border p-3 text-xs text-muted-foreground space-y-1 max-h-24 overflow-y-auto">
                {[...application.statusHistory].reverse().map((entry, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{t(`status.${entry.status}`)}</span>
                    <span>{new Date(entry.changedAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <Label>{t("applications.notes")}</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("applications.jobDescription")}</Label>
            <Textarea value={form.jobDescription} onChange={(e) => set("jobDescription", e.target.value)} rows={4} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
            <Button type="submit">{application ? t("applications.saveChanges") : t("applications.add")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}