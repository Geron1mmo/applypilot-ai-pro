import { useRef, useState } from "react"
import { Download, Moon, Sun, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useI18n } from "@/contexts/I18nContext"
import { useTheme } from "@/contexts/ThemeContext"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { importDataSchema } from "@/lib/validation"
import {
  clearAllData,
  exportAllData,
  getSettings,
  importAllData,
  saveSettings,
} from "@/lib/storage"
import type { AppSettings, ThemeMode } from "@/types"
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
import { Switch } from "@/components/ui/switch"

export function Settings() {
  const { user, logout } = useAuth()
  const { t } = useI18n()
  const { theme, setTheme } = useTheme()
  const fileRef = useRef<HTMLInputElement>(null)
  const [settings, setSettingsState] = useState<AppSettings>(() =>
    user ? getSettings(user.id) : {
      theme: "dark",
      language: "uk",
      autoLogoutMinutes: 30,
      emailNotifications: true,
      interviewReminders: true,
      weeklyDigest: false,
      weeklyApplicationGoal: 5,
    }
  )

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value }
    setSettingsState(updated)
    if (user) saveSettings(user.id, updated)
    if (key === "theme") setTheme(value as ThemeMode)
  }

  const handleExport = () => {
    const blob = new Blob([exportAllData()], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `applypilot-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(t("settings.exported"))
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = reader.result as string
        const parsed = JSON.parse(json)
        const validated = importDataSchema.safeParse(parsed)
        if (!validated.success) {
          toast.error(t("settings.invalidImport"))
          return
        }
        importAllData(json)
        toast.success(t("settings.imported"))
        window.location.reload()
      } catch {
        toast.error(t("settings.parseError"))
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const handleClear = () => {
    if (!confirm(t("settings.clearData"))) return
    clearAllData()
    logout()
    toast.success(t("settings.cleared"))
    window.location.href = "/"
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("settings.appearance")}</CardTitle>
          <CardDescription>{t("settings.appearanceDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              <Label>{t("settings.theme")}</Label>
            </div>
            <Select value={theme} onValueChange={(v) => updateSetting("theme", v as ThemeMode)}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">{t("settings.dark")}</SelectItem>
                <SelectItem value="light">{t("settings.light")}</SelectItem>
                <SelectItem value="system">{t("settings.system")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("common.language")}</Label>
            <LanguageSwitcher />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("settings.weeklyGoal")}</CardTitle>
          <CardDescription>{t("settings.weeklyGoalDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            min={1}
            max={50}
            value={settings.weeklyApplicationGoal}
            onChange={(e) =>
              updateSetting("weeklyApplicationGoal", Math.max(1, Number(e.target.value) || 1))
            }
            className="w-32"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("settings.notifications")}</CardTitle>
          <CardDescription>{t("settings.notificationsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {([
            ["emailNotifications", t("settings.emailNotif")],
            ["interviewReminders", t("settings.interviewRemif")],
            ["weeklyDigest", t("settings.weeklyDigest")],
          ] as const).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <Label>{label}</Label>
              <Switch
                checked={settings[key]}
                onCheckedChange={(c) => updateSetting(key, c)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("settings.syncTitle")}</CardTitle>
          <CardDescription>{t("settings.syncDesc")}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("settings.data")}</CardTitle>
          <CardDescription>{t("settings.dataDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={handleExport}>
            <Download className="mr-2 size-4" /> {t("settings.exportJson")}
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-2 size-4" /> {t("settings.importJson")}
          </Button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <Button variant="destructive" className="w-full justify-start" onClick={handleClear}>
            <Trash2 className="mr-2 size-4" /> {t("settings.clearData")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}