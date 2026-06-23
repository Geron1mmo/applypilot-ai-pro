import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  )

  const resolvedTheme = useMemo((): "dark" | "light" => {
    if (theme === "system") {
      return systemPrefersDark ? "dark" : "light"
    }
    return theme
  }, [theme, systemPrefersDark])

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
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => setSystemPrefersDark(mq.matches)
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