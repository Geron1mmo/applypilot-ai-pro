import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Save, ScanSearch, Sparkles } from "lucide-react"
import { toast } from "sonner"
import type { CVAnalysis } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import { useI18n } from "@/contexts/I18nContext"
import { useApplications } from "@/hooks/useApplications"
import { buildApplicationUpdate } from "@/lib/applications"
import { analyzeCV } from "@/lib/cvAnalyzer"
import { saveAnalysis, getAnalyses } from "@/lib/storage"
import { truncateText } from "@/lib/sanitizer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

export function CVAnalyzer() {
  const { user } = useAuth()
  const { t } = useI18n()
  const { applications, upsert } = useApplications()
  const [searchParams] = useSearchParams()
  const [cvText, setCvText] = useState("")
  const [jobText, setJobText] = useState("")
  const [prefillCompany, setPrefillCompany] = useState<string | null>(null)
  const [linkedAppId, setLinkedAppId] = useState<string | null>(null)

  useEffect(() => {
    const job = searchParams.get("job")
    const company = searchParams.get("company")
    const appId = searchParams.get("appId")
    if (job) setJobText(job)
    if (company) setPrefillCompany(company)
    if (appId) setLinkedAppId(appId)
  }, [searchParams])

  const [result, setResult] = useState<ReturnType<typeof analyzeCV> | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [history, setHistory] = useState<CVAnalysis[]>(() =>
    user ? getAnalyses(user.id) : []
  )

  const handleAnalyze = () => {
    if (!cvText.trim() || !jobText.trim()) {
      toast.error(t("analyzer.needBoth"))
      return
    }
    setAnalyzing(true)
    setTimeout(() => {
      const analysis = analyzeCV(cvText, jobText)
      setResult(analysis)
      setAnalyzing(false)

      if (user) {
        const record: CVAnalysis = {
          id: crypto.randomUUID(),
          userId: user.id,
          cvTextPreview: truncateText(cvText, 100),
          jobDescriptionPreview: truncateText(jobText, 100),
          ...analysis,
          createdAt: new Date().toISOString(),
        }
        saveAnalysis(record)
        setHistory(getAnalyses(user.id))
        toast.success(t("analyzer.savedHistory"))
      }
    }, 600)
  }

  const handleSaveToApp = () => {
    if (!result || !linkedAppId) return
    const app = applications.find((a) => a.id === linkedAppId)
    if (!app) return
    upsert(
      buildApplicationUpdate(app, {
        ...app,
        cvMatchScore: result.matchScore,
        updatedAt: new Date().toISOString(),
      })
    )
    toast.success(t("analyzer.scoreSaved"))
  }

  const scoreColor =
    !result ? "" :
    result.matchScore >= 80 ? "text-emerald-400" :
    result.matchScore >= 60 ? "text-amber-400" : "text-red-400"

  const linkedApp = linkedAppId ? applications.find((a) => a.id === linkedAppId) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("analyzer.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("analyzer.subtitle")}</p>
        {prefillCompany && (
          <p className="mt-1 text-sm text-primary">
            {t("analyzer.analyzingFor")} <strong>{prefillCompany}</strong>
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("analyzer.yourCv")}</CardTitle>
            <CardDescription>{t("analyzer.yourCvDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={12}
              placeholder={t("analyzer.cvPlaceholder")}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("analyzer.jobDesc")}</CardTitle>
            <CardDescription>{t("analyzer.jobDescDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={12}
              placeholder={t("analyzer.jobPlaceholder")}
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={handleAnalyze} disabled={analyzing}>
          <Sparkles className="mr-2 size-4" />
          {analyzing ? t("analyzer.analyzing") : t("analyzer.analyze")}
        </Button>
        {result && linkedApp && (
          <Button size="lg" variant="outline" onClick={handleSaveToApp}>
            <Save className="mr-2 size-4" />
            {t("analyzer.saveToApp")} ({linkedApp.company})
          </Button>
        )}
      </div>

      {result && (
        <div className="space-y-4">
          <Card className="border-primary/30">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex size-20 items-center justify-center rounded-full border-4 border-primary/30">
                <span className={`text-2xl font-bold ${scoreColor}`}>{result.matchScore}%</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{t("analyzer.matchScore")}</h3>
                <Progress value={result.matchScore} className="mt-2 h-2" />
                <p className="mt-2 text-sm text-muted-foreground">{t("analyzer.matchDesc")}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="text-sm">{t("analyzer.matchedSkills")}</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {result.matchedSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("analyzer.noneDetected")}</p>
                ) : result.matchedSkills.map((s) => (
                  <Badge key={s} variant="secondary" className="bg-emerald-500/10 text-emerald-400">{s}</Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">{t("analyzer.missingSkills")}</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {result.missingSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("analyzer.greatCoverage")}</p>
                ) : result.missingSkills.map((s) => (
                  <Badge key={s} variant="secondary" className="bg-red-500/10 text-red-400">{s}</Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">{t("analyzer.recommended")}</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {result.recommendedKeywords.map((k) => (
                  <Badge key={k} variant="outline">{k}</Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-sm">{t("analyzer.weakAreas")}</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {result.weakAreas.map((w) => (
                    <li key={w} className="flex items-start gap-2">
                      <ScanSearch className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                      {w}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">{t("analyzer.suggestions")}</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {result.suggestions.map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("analyzer.history")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.slice(0, 5).map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <div>
                  <p className="font-medium">{h.jobDescriptionPreview}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(h.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge>{h.matchScore}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}