import type { Locale } from "./types"
import { createTranslator } from "./index"

export function getStoredLocale(): Locale {
  const stored = localStorage.getItem("applypilot_locale") as Locale | null
  return stored ?? "uk"
}

export function getT() {
  return createTranslator(getStoredLocale())
}