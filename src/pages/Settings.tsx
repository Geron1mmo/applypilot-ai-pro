import { useRef, useState } from "react"
import { Download, Moon, Sun, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { importDataSchema } from "@/lib/validation"
import {
  clearAllData,
  exportAllData,
  getSettings,
  importAllData,
  saveSettings,
} from "@/lib/storage"
import type { ThemeMode } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  const { theme, setTheme } = useTheme()
  const fileRef = useRef<HTMLInputElement>(null)
  const [settings, setSettingsState] = useState(() =>
    user ? getSettings(user.id) : {
      theme: "dark" as ThemeMode,
      autoLogoutMinutes: 30,
      emailNotifications: true,
      interviewReminders: true,
      weeklyDigest: false,
    }
  )

  const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
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
    toast.success("Data exported successfully")
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
          toast.error("Invalid backup file format")
          return
        }
        importAllData(json)
        toast.success("Data imported. Refreshing...")
        window.location.reload()
      } catch {
        toast.error("Failed to parse backup file")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const handleClear = () => {
    if (!confirm("This will delete ALL local data. Are you sure?")) return
    clearAllData()
    logout()
    toast.success("All data cleared")
    window.location.href = "/"
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">App preferences and data management</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Customize how ApplyPilot looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              <Label>Theme</Label>
            </div>
            <Select value={theme} onValueChange={(v) => updateSetting("theme", v as ThemeMode)}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>Mock notification preferences (local demo)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {([
            ["emailNotifications", "Email notifications"],
            ["interviewReminders", "Interview reminders"],
            ["weeklyDigest", "Weekly digest"],
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
          <CardTitle className="text-base">Data Management</CardTitle>
          <CardDescription>Export, import, or clear your local data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={handleExport}>
            <Download className="mr-2 size-4" /> Export all data as JSON
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-2 size-4" /> Import data from JSON
          </Button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <Button variant="destructive" className="w-full justify-start" onClick={handleClear}>
            <Trash2 className="mr-2 size-4" /> Clear all local data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}