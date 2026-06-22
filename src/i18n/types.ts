export type Locale = "en" | "uk" | "cs"

export type TranslationDict = {
  common: Record<string, string>
  nav: Record<string, string>
  auth: Record<string, string>
  landing: Record<string, string>
  dashboard: Record<string, string>
  applications: Record<string, string>
  kanban: Record<string, string>
  analyzer: Record<string, string>
  documents: Record<string, string>
  analytics: Record<string, string>
  profile: Record<string, string>
  settings: Record<string, string>
  security: Record<string, string>
  billing: Record<string, string>
  help: Record<string, string>
  status: Record<string, string>
  priority: Record<string, string>
  workMode: Record<string, string>
  reminders: Record<string, string>
}