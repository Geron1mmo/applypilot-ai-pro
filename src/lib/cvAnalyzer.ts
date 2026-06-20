import type { CVAnalysisResult } from "@/types"

const SKILL_DICTIONARY = [
  "JavaScript",
  "TypeScript",
  "React",
  "Vue",
  "Angular",
  "Node.js",
  "Express",
  "Next.js",
  "HTML",
  "CSS",
  "Tailwind",
  "REST API",
  "GraphQL",
  "Git",
  "GitHub",
  "Docker",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "Testing",
  "Jest",
  "Cypress",
  "CI/CD",
  "Figma",
  "UI/UX",
  "Agile",
  "Scrum",
  "API integration",
  "authentication",
  "security",
  "performance",
  "responsive design",
]

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ")
}

function extractSkills(text: string): Set<string> {
  const normalized = normalize(text)
  const found = new Set<string>()
  for (const skill of SKILL_DICTIONARY) {
    const pattern = skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    if (new RegExp(`\\b${pattern}\\b`, "i").test(normalized)) {
      found.add(skill)
    }
  }
  return found
}

function extractKeywords(text: string): string[] {
  const words = normalize(text)
    .split(/\s+/)
    .filter((w) => w.length > 3)
  const stopWords = new Set([
    "with", "that", "this", "from", "have", "will", "your", "about",
    "their", "they", "them", "been", "being", "were", "what", "when",
    "where", "which", "while", "such", "into", "over", "also", "able",
  ])
  return words.filter((w) => !stopWords.has(w))
}

function keywordDensity(text: string): Record<string, number> {
  const keywords = extractKeywords(text)
  const density: Record<string, number> = {}
  for (const kw of keywords) {
    density[kw] = (density[kw] ?? 0) + 1
  }
  return Object.fromEntries(
    Object.entries(density)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
  )
}

export function analyzeCV(cvText: string, jobDescription: string): CVAnalysisResult {
  const cvSkills = extractSkills(cvText)
  const jobSkills = extractSkills(jobDescription)

  const matchedSkills = [...jobSkills].filter((s) => cvSkills.has(s))
  const missingSkills = [...jobSkills].filter((s) => !cvSkills.has(s))

  const cvKeywords = new Set(extractKeywords(cvText))
  const jobKeywords = extractKeywords(jobDescription)
  const jobKeywordSet = new Set(jobKeywords)
  const overlap = jobKeywords.filter((k) => cvKeywords.has(k))
  const overlapRatio = jobKeywordSet.size > 0 ? overlap.length / jobKeywordSet.size : 0

  const skillRatio = jobSkills.size > 0 ? matchedSkills.length / jobSkills.size : 0.5
  const rawScore = skillRatio * 70 + overlapRatio * 30
  const matchScore = Math.round(Math.min(100, Math.max(0, rawScore * 100)))

  const recommendedKeywords = [...jobKeywordSet]
    .filter((k) => !cvKeywords.has(k))
    .slice(0, 10)

  const weakAreas: string[] = []
  if (missingSkills.length > 3) weakAreas.push("Technical skills gap vs job requirements")
  if (overlapRatio < 0.3) weakAreas.push("Low keyword alignment with job description")
  if (cvText.length < 500) weakAreas.push("CV content may be too brief")
  if (!/experience|project|built|developed|led/i.test(cvText)) {
    weakAreas.push("Limited evidence of hands-on experience")
  }

  const suggestions: string[] = []
  if (missingSkills.length > 0) {
    suggestions.push(
      `Highlight experience with: ${missingSkills.slice(0, 5).join(", ")}`
    )
  }
  if (recommendedKeywords.length > 0) {
    suggestions.push(
      `Add keywords from the job post: ${recommendedKeywords.slice(0, 5).join(", ")}`
    )
  }
  if (matchScore < 60) {
    suggestions.push("Tailor your CV summary to mirror the role's core responsibilities")
  }
  if (matchScore < 40) {
    suggestions.push("Consider adding a dedicated skills section matching the job requirements")
  }
  suggestions.push("Quantify achievements with metrics (%, $, time saved) where possible")

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    recommendedKeywords,
    weakAreas,
    suggestions,
    keywordDensity: keywordDensity(cvText),
  }
}