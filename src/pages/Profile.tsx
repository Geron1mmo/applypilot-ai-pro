import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useI18n } from "@/contexts/I18nContext"
import { profileSchema } from "@/lib/validation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

const WORK_MODES = ["remote", "hybrid", "onsite"] as const

export function Profile() {
  const { t } = useI18n()
  const { user, updateUser } = useAuth()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    jobTargetTitle: user?.profile.jobTargetTitle ?? "",
    location: user?.profile.location ?? "",
    preferredWorkMode: user?.profile.preferredWorkMode ?? "remote",
    bio: user?.profile.bio ?? "",
    skills: user?.profile.skills.join(", ") ?? "",
  })

  const handleSave = () => {
    const parsed = profileSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path[0]?.toString() ?? "form"] = i.message
      })
      setErrors(fieldErrors)
      return
    }
    if (!user) return

    updateUser({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      profile: {
        jobTargetTitle: parsed.data.jobTargetTitle,
        location: parsed.data.location,
        preferredWorkMode: parsed.data.preferredWorkMode,
        bio: parsed.data.bio,
        skills: parsed.data.skills.split(",").map((s) => s.trim()).filter(Boolean),
      },
    })
    toast.success(t("profile.saved"))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("profile.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="bg-primary/20 text-primary text-lg">
                {user ? getInitials(user.fullName) : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.fullName}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{t("auth.fullName")}</Label>
              <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t("auth.email")}</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t("profile.targetTitle")}</Label>
              <Input value={form.jobTargetTitle} onChange={(e) => setForm({ ...form, jobTargetTitle: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("profile.location")}</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t("profile.workMode")}</Label>
              <Select value={form.preferredWorkMode} onValueChange={(v) => setForm({ ...form, preferredWorkMode: v as "remote" | "hybrid" | "onsite" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WORK_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>{t(`workMode.${mode}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t("profile.bio")}</Label>
            <Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("profile.skills")}</Label>
            <Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, TypeScript, Node.js" />
          </div>
          <Button onClick={handleSave}>{t("common.save")}</Button>
        </CardContent>
      </Card>
    </div>
  )
}