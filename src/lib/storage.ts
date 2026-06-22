import type {
  AppData,
  AppSettings,
  Application,
  CVAnalysis,
  Document,
  Session,
  User,
} from "@/types"
import { normalizeApplication } from "@/lib/applications"

const DATA_KEY = "applypilot_data"
const SESSION_KEY = "applypilot_session"
const DATA_VERSION = "1.0.0"

const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  language: "uk",
  autoLogoutMinutes: 30,
  emailNotifications: true,
  interviewReminders: true,
  weeklyDigest: false,
  weeklyApplicationGoal: 5,
}

function emptyData(): AppData {
  return {
    version: DATA_VERSION,
    users: [],
    applications: [],
    analyses: [],
    documents: [],
    settings: {},
  }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    if (!raw) return emptyData()
    const parsed = JSON.parse(raw) as AppData
    if (!parsed.version) return emptyData()
    return {
      version: parsed.version,
      users: Array.isArray(parsed.users) ? parsed.users : [],
      applications: Array.isArray(parsed.applications) ? parsed.applications : [],
      analyses: Array.isArray(parsed.analyses) ? parsed.analyses : [],
      documents: Array.isArray(parsed.documents) ? parsed.documents : [],
      settings: parsed.settings ?? {},
    }
  } catch {
    return emptyData()
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(DATA_KEY, JSON.stringify(data))
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function setSession(session: Session | null): void {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function getUserById(id: string): User | undefined {
  return loadData().users.find((u) => u.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return loadData().users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  )
}

export function saveUser(user: User): void {
  const data = loadData()
  const idx = data.users.findIndex((u) => u.id === user.id)
  if (idx >= 0) data.users[idx] = user
  else data.users.push(user)
  saveData(data)
}

export function getApplications(userId: string): Application[] {
  return loadData()
    .applications.filter((a) => a.userId === userId)
    .map((a) => normalizeApplication(a as Application))
}

export function saveApplication(app: Application): void {
  const data = loadData()
  const idx = data.applications.findIndex((a) => a.id === app.id)
  if (idx >= 0) data.applications[idx] = app
  else data.applications.push(app)
  saveData(data)
}

export function deleteApplication(id: string): void {
  const data = loadData()
  data.applications = data.applications.filter((a) => a.id !== id)
  saveData(data)
}

export function getAnalyses(userId: string): CVAnalysis[] {
  return loadData().analyses
    .filter((a) => a.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function saveAnalysis(analysis: CVAnalysis): void {
  const data = loadData()
  data.analyses.push(analysis)
  saveData(data)
}

export function getDocuments(userId: string): Document[] {
  return loadData().documents.filter((d) => d.userId === userId)
}

export function saveDocument(doc: Document): void {
  const data = loadData()
  if (doc.isPrimary) {
    data.documents = data.documents.map((d) =>
      d.userId === doc.userId && d.type === "cv"
        ? { ...d, isPrimary: d.id === doc.id }
        : d
    )
  }
  const idx = data.documents.findIndex((d) => d.id === doc.id)
  if (idx >= 0) data.documents[idx] = doc
  else data.documents.push(doc)
  saveData(data)
}

export function deleteDocument(id: string): void {
  const data = loadData()
  data.documents = data.documents.filter((d) => d.id !== id)
  saveData(data)
}

export function getSettings(userId: string): AppSettings {
  const data = loadData()
  const raw = data.settings[userId]
  return raw
    ? { ...DEFAULT_SETTINGS, ...raw, language: raw.language ?? DEFAULT_SETTINGS.language, weeklyApplicationGoal: raw.weeklyApplicationGoal ?? DEFAULT_SETTINGS.weeklyApplicationGoal }
    : { ...DEFAULT_SETTINGS }
}

export function saveSettings(userId: string, settings: AppSettings): void {
  const data = loadData()
  data.settings[userId] = settings
  saveData(data)
}

export function exportAllData(): string {
  return JSON.stringify(loadData(), null, 2)
}

export function importAllData(json: string): AppData {
  const parsed = JSON.parse(json) as AppData
  if (!parsed.version) throw new Error("Invalid data format: missing version")
  saveData({
    version: parsed.version,
    users: Array.isArray(parsed.users) ? (parsed.users as User[]) : [],
    applications: Array.isArray(parsed.applications)
      ? (parsed.applications as Application[])
      : [],
    analyses: Array.isArray(parsed.analyses) ? (parsed.analyses as CVAnalysis[]) : [],
    documents: Array.isArray(parsed.documents) ? (parsed.documents as Document[]) : [],
    settings: (parsed.settings as Record<string, AppSettings>) ?? {},
  })
  return loadData()
}

export function clearAllData(): void {
  localStorage.removeItem(DATA_KEY)
  localStorage.removeItem(SESSION_KEY)
}