import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Locale } from "@/i18n/types"
import { createTranslator } from "@/i18n"
import { getSettings, saveSettings } from "@/lib/storage"

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  children,
  userId,
}: {
  children: ReactNode
  userId?: string
}) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (userId) {
      const lang = getSettings(userId).language
      if (lang) return lang
    }
    const stored = localStorage.getItem("applypilot_locale") as Locale | null
    return stored ?? "uk"
  })

  const [prevUserId, setPrevUserId] = useState(userId)

  if (userId !== prevUserId) {
    setPrevUserId(userId)
    if (userId) {
      const lang = getSettings(userId).language
      if (lang) {
        setLocaleState(lang)
        localStorage.setItem("applypilot_locale", lang)
      }
    }
  }

  const setLocale = useCallback(
    (l: Locale) => {
      setLocaleState(l)
      localStorage.setItem("applypilot_locale", l)
      if (userId) {
        const settings = getSettings(userId)
        saveSettings(userId, { ...settings, language: l })
      }
    },
    [userId]
  )

  const t = useMemo(() => createTranslator(locale), [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}