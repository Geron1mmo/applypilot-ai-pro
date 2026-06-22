import { Link } from "react-router-dom"
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Lock,
  ScanSearch,
  Shield,
  Zap,
} from "lucide-react"
import { useI18n } from "@/contexts/I18nContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Landing() {
  const { t } = useI18n()

  const features = [
    {
      icon: Briefcase,
      title: t("landing.feature1Title"),
      description: t("landing.feature1Desc"),
    },
    {
      icon: ScanSearch,
      title: t("landing.feature2Title"),
      description: t("landing.feature2Desc"),
    },
    {
      icon: BarChart3,
      title: t("landing.feature3Title"),
      description: t("landing.feature3Desc"),
    },
    {
      icon: Lock,
      title: t("landing.feature4Title"),
      description: t("landing.feature4Desc"),
    },
  ]

  const bullets = [
    t("landing.bullet1"),
    t("landing.bullet2"),
    t("landing.bullet3"),
    t("landing.bullet4"),
  ]

  const demoStatuses = ["applied", "interview", "offer"] as const

  const pricingFeatures = [
    `${t("billing.unlimited")} ${t("nav.applications")}`,
    t("nav.cvAnalyzer"),
    t("nav.documents"),
    t("nav.analytics"),
    t("settings.exportJson"),
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">ApplyPilot AI Pro</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">{t("landing.signIn")}</Link>
            </Button>
            <Button asChild>
              <Link to="/register">{t("landing.getStarted")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">{t("landing.badge")}</Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {t("landing.heroTitle")}{" "}
          <span className="gradient-text">ApplyPilot AI Pro</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          {t("landing.heroSubtitle")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/register">
              {t("landing.getStarted")}
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">{t("landing.tryDemo")}</Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-border/50 bg-card/80">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">{t("landing.builtFor")}</h2>
            <p className="mt-4 text-muted-foreground">
              {t("landing.builtForDesc")}
            </p>
            <ul className="mt-6 space-y-3">
              {bullets.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Zap className="size-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Card className="overflow-hidden border-border/50">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-primary/20 to-blue-500/10 p-8">
                <div className="space-y-3 rounded-lg border border-border/50 bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t("nav.dashboard")}</span>
                    <Badge>{t("applications.total", { n: 6 })}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {demoStatuses.map((s, i) => (
                      <div key={s} className="rounded-md bg-muted p-3 text-center">
                        <p className="text-lg font-bold">{[2, 2, 1][i]}</p>
                        <p className="text-xs text-muted-foreground">{t(`status.${s}`)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-3/4 rounded-full bg-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">{t("dashboard.avgMatch")}: 78%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t border-border bg-card/30 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <Shield className="mx-auto size-10 text-primary" />
          <h2 className="mt-4 text-2xl font-bold">{t("landing.privacyTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {t("landing.privacyDesc")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-2xl font-bold">{t("landing.pricingTitle")}</h2>
        <div className="mx-auto mt-8 max-w-sm">
          <Card className="border-primary/30">
            <CardHeader className="text-center">
              <Badge className="mx-auto w-fit">{t("billing.currentPlan")}</Badge>
              <CardTitle className="text-3xl">{t("common.free")}</CardTitle>
              <CardDescription>{t("landing.pricingFree")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {pricingFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Zap className="size-3 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" asChild>
                <Link to="/register">{t("landing.pricingBtn")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {t("landing.footer")}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-foreground">{t("auth.signIn")}</Link>
            <Link to="/register" className="hover:text-foreground">{t("auth.register")}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}