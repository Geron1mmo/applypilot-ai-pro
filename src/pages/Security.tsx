import { useState } from "react"
import { Lock, Shield, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useI18n } from "@/contexts/I18nContext"
import { getPasswordStrength, hashPassword, verifyPassword } from "@/lib/crypto"
import { changePasswordSchema } from "@/lib/validation"
import { getSession, getSettings, saveSettings, saveUser } from "@/lib/storage"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const AUTO_LOGOUT_OPTIONS = [
  { value: "0", labelKey: "security.disabled" },
  { value: "15", labelKey: "security.min15" },
  { value: "30", labelKey: "security.min30" },
  { value: "60", labelKey: "security.hour1" },
] as const

const SECURITY_TIPS = ["security.tip1", "security.tip2", "security.tip3", "security.tip4"] as const

export function Security() {
  const { t } = useI18n()
  const { user, updateUser } = useAuth()
  const session = getSession()
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [twoFA, setTwoFA] = useState(false)
  const [autoLogout, setAutoLogout] = useState(
    user ? getSettings(user.id).autoLogoutMinutes : 30
  )

  const strength = getPasswordStrength(form.newPassword)

  const handleChangePassword = async () => {
    const parsed = changePasswordSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path[0]?.toString() ?? "form"] = i.message
      })
      setErrors(fieldErrors)
      return
    }
    if (!user) return

    const valid = await verifyPassword(
      parsed.data.currentPassword,
      user.salt,
      user.passwordHash
    )
    if (!valid) {
      toast.error(t("security.wrongCurrent"))
      return
    }

    const newHash = await hashPassword(parsed.data.newPassword, user.salt)
    const updated = { ...user, passwordHash: newHash }
    saveUser(updated)
    updateUser(updated)
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    toast.success(t("security.passwordUpdated"))
  }

  const handleAutoLogout = (minutes: number) => {
    setAutoLogout(minutes)
    if (user) {
      const settings = getSettings(user.id)
      saveSettings(user.id, { ...settings, autoLogoutMinutes: minutes })
    }
    toast.success(t("security.autoLogoutUpdated"))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("security.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("security.subtitle")}</p>
      </div>

      <Alert>
        <Shield className="size-4" />
        <AlertTitle>{t("security.localTitle")}</AlertTitle>
        <AlertDescription>
          {t("security.localDesc")}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="size-4" /> {t("security.changePassword")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t("security.current")}</Label>
            <Input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
            {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>{t("security.new")}</Label>
            <Input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
            {form.newPassword && (
              <div className="space-y-1">
                <Progress value={strength.score} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{t("auth.strength")}: {strength.label}</p>
              </div>
            )}
            {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>{t("security.confirm")}</Label>
            <Input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
          </div>
          <Button onClick={handleChangePassword}>{t("security.updatePassword")}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("security.session")}</CardTitle>
          <CardDescription>{t("security.sessionDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("security.sessionStarted")}</span>
            <span>{session ? new Date(session.createdAt).toLocaleString() : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("security.lastActivity")}</span>
            <span>{session ? new Date(session.lastActivity).toLocaleString() : "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("security.autoLogout")}</Label>
            <Select value={String(autoLogout)} onValueChange={(v) => handleAutoLogout(Number(v))}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {AUTO_LOGOUT_OPTIONS.map(({ value, labelKey }) => (
                  <SelectItem key={value} value={value}>{t(labelKey)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="size-4" /> {t("security.twoFa")}
          </CardTitle>
          <CardDescription>{t("security.twoFaDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("security.enable2fa")}</p>
              <p className="text-xs text-muted-foreground">{t("security.enable2faDesc")}</p>
            </div>
            <Switch checked={twoFA} onCheckedChange={setTwoFA} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{t("security.tips")}</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {SECURITY_TIPS.map((tipKey) => (
              <li key={tipKey}>• {t(tipKey)}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}