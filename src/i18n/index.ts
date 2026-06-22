import type { Locale, TranslationDict } from "./types"
import en from "./locales/en"
import uk from "./locales/uk"
import cs from "./locales/cs"

export const locales: Record<Locale, TranslationDict> = { en, uk, cs }

export const localeLabels: Record<Locale, string> = {
  en: "English",
  uk: "Українська",
  cs: "Čeština",
}

export function createTranslator(locale: Locale) {
  const dict = locales[locale] ?? locales.en
  return function t(key: string, params?: Record<string, string | number>): string {
    const parts = key.split(".")
    let cur: unknown = dict
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in (cur as object)) {
        cur = (cur as Record<string, unknown>)[p]
      } else {
        const fallback = parts.reduce((acc: unknown, part, i) => {
          if (i === 0) return (locales.en as Record<string, unknown>)[part]
          return acc && typeof acc === "object"
            ? (acc as Record<string, unknown>)[part]
            : undefined
        }, undefined)
        cur = fallback ?? key
        break
      }
    }
    let result = String(cur)
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        result = result.replaceAll(`{{${k}}}`, String(v))
      }
    }
    return result
  }
}