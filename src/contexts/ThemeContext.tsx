import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { ThemeMode } from "@/types"
import { getSettings, saveSettings } from "@/lib/storage"

interface ThemeContextValue {
  theme: ThemeMode
  resolvedTheme: "dark" | "light"
  setTheme: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function resolveTheme(mode: ThemeMode): "dark" | "light" {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }
  return mode
}

function applyTheme(resolved: "dark" | "light") {
  const root = document.documentElement
  root.classList.remove("dark", "light")
  root.classList.add(resolved)
}

export function ThemeProvider({
  children,
  userId,
}: {
  children: ReactNode
  userId?: string
}) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (userId) return getSettings(userId).theme
    const stored = localStorage.getItem("applypilot_theme") as ThemeMode | null
    return stored ?? "dark"
  })

  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() =>
    resolveTheme(theme)
  )

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeState(mode)
      if (userId) {
        const settings = getSettings(userId)
        saveSettings(userId, { ...settings, theme: mode })
      } else {
        localStorage.setItem("applypilot_theme", mode)
      }
    },
    [userId]
  )

  useEffect(() => {
    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [theme])

  useEffect(() => {
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      const resolved = resolveTheme("system")
      setResolvedTheme(resolved)
      applyTheme(resolved)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}