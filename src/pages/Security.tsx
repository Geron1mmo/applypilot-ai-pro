import { useState } from "react"
import { Lock, Shield, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
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

export function Security() {
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
      toast.error("Current password is incorrect")
      return
    }

    const newHash = await hashPassword(parsed.data.newPassword, user.salt)
    const updated = { ...user, passwordHash: newHash }
    saveUser(updated)
    updateUser(updated)
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    toast.success("Password updated")
  }

  const handleAutoLogout = (minutes: number) => {
    setAutoLogout(minutes)
    if (user) {
      const settings = getSettings(user.id)
      saveSettings(user.id, { ...settings, autoLogoutMinutes: minutes })
    }
    toast.success("Auto-logout setting updated")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Security</h1>
        <p className="text-sm text-muted-foreground">Manage your account security settings</p>
      </div>

      <Alert>
        <Shield className="size-4" />
        <AlertTitle>Local-first security</AlertTitle>
        <AlertDescription>
          Passwords are hashed with Web Crypto API (SHA-256 + salt) and stored in your browser.
          This is a portfolio demo — not production-grade authentication.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="size-4" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Current Password</Label>
            <Input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
            {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <Input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
            {form.newPassword && (
              <div className="space-y-1">
                <Progress value={strength.score} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{strength.label}</p>
              </div>
            )}
            {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Confirm New Password</Label>
            <Input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
          </div>
          <Button onClick={handleChangePassword}>Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session</CardTitle>
          <CardDescription>Current session information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Session started</span>
            <span>{session ? new Date(session.createdAt).toLocaleString() : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last activity</span>
            <span>{session ? new Date(session.lastActivity).toLocaleString() : "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Auto logout after inactivity</Label>
            <Select value={String(autoLogout)} onValueChange={(v) => handleAutoLogout(Number(v))}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Disabled</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="size-4" /> Two-Factor Authentication
          </CardTitle>
          <CardDescription>Demo only — not functional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Enable 2FA (Demo)</p>
              <p className="text-xs text-muted-foreground">This toggle is for UI demonstration only</p>
            </div>
            <Switch checked={twoFA} onCheckedChange={setTwoFA} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Security Tips</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use a strong, unique password even for local accounts</li>
            <li>• Export your data regularly as a backup</li>
            <li>• Clear browser data will delete all ApplyPilot data</li>
            <li>• Do not use this auth system for real sensitive data</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}