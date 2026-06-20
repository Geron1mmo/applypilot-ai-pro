export type UserRole = "user" | "demo"

export type WorkMode = "remote" | "hybrid" | "onsite"

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interview"
  | "technical"
  | "offer"
  | "rejected"

export type ApplicationPriority = "low" | "medium" | "high"

export type DocumentType = "cv" | "cover-letter"

export type ThemeMode = "dark" | "light" | "system"

export interface UserProfile {
  jobTargetTitle: string
  location: string
  preferredWorkMode: WorkMode
  bio: string
  skills: string[]
}

export interface User {
  id: string
  fullName: string
  email: string
  passwordHash: string
  salt: string
  role: UserRole
  createdAt: string
  profile: UserProfile
}

export interface Session {
  token: string
  userId: string
  createdAt: string
  lastActivity: string
}

export interface Application {
  id: string
  userId: string
  company: string
  role: string
  location: string
  workMode: WorkMode
  salaryMin: number | null
  salaryMax: number | null
  currency: string
  jobUrl: string
  hrName: string
  hrEmail: string
  status: ApplicationStatus
  priority: ApplicationPriority
  deadline: string | null
  dateApplied: string | null
  notes: string
  jobDescription: string
  cvMatchScore: number | null
  createdAt: string
  updatedAt: string
}

export interface CVAnalysis {
  id: string
  userId: string
  cvTextPreview: string
  jobDescriptionPreview: string
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  recommendedKeywords: string[]
  weakAreas: string[]
  suggestions: string[]
  keywordDensity: Record<string, number>
  createdAt: string
}

export interface Document {
  id: string
  userId: string
  type: DocumentType
  title: string
  content: string
  tags: string[]
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  theme: ThemeMode
  autoLogoutMinutes: number
  emailNotifications: boolean
  interviewReminders: boolean
  weeklyDigest: boolean
}

export interface AppData {
  version: string
  users: User[]
  applications: Application[]
  analyses: CVAnalysis[]
  documents: Document[]
  settings: Record<string, AppSettings>
}

export interface CVAnalysisResult {
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  recommendedKeywords: string[]
  weakAreas: string[]
  suggestions: string[]
  keywordDensity: Record<string, number>
}