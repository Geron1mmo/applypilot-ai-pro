import { Check, CreditCard } from "lucide-react"
import { useI18n } from "@/contexts/I18nContext"
import { useApplications } from "@/hooks/useApplications"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function Billing() {
  const { t } = useI18n()
  const { applications } = useApplications()

  const features = [
    { nameKey: "nav.applications", free: t("billing.unlimited"), pro: t("billing.unlimited") },
    { nameKey: "nav.cvAnalyzer", free: true, pro: true },
    { nameKey: "nav.kanban", free: true, pro: true },
    { nameKey: "nav.analytics", free: true, pro: true },
    { nameKey: "nav.documents", free: true, pro: true },
    { nameKey: "billing.cloudSync", free: false, pro: t("common.comingSoon") },
    { nameKey: "billing.teamCollab", free: false, pro: t("common.comingSoon") },
    { nameKey: "billing.aiLetters", free: false, pro: t("common.comingSoon") },
  ]

  const freePlanFeatures = [
    `${t("billing.unlimited")} ${t("nav.applications")}`,
    t("analyzer.subtitle"),
    t("nav.analytics"),
    t("settings.exportJson"),
  ]

  const proPlanFeatures = [
    t("billing.cloudSync"),
    t("billing.aiLetters"),
    t("billing.teamCollab"),
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("billing.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("billing.subtitle")}</p>
      </div>

      <Alert>
        <CreditCard className="size-4" />
        <AlertTitle>{t("billing.demoAlert")}</AlertTitle>
        <AlertDescription>
          {t("billing.demoAlertDesc")}
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{applications.length}</p>
            <p className="text-xs text-muted-foreground">{t("billing.tracked")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">∞</p>
            <p className="text-xs text-muted-foreground">{t("billing.analyses")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">$0</p>
            <p className="text-xs text-muted-foreground">{t("billing.monthlyCost")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/30">
          <CardHeader>
            <Badge className="w-fit">{t("billing.currentPlan")}</Badge>
            <CardTitle>{t("billing.freePlan")}</CardTitle>
            <CardDescription>{t("billing.freePlanDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$0<span className="text-base font-normal text-muted-foreground">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm">
              {freePlanFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-400" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <Badge variant="secondary" className="w-fit">{t("common.comingSoon")}</Badge>
            <CardTitle>{t("billing.proPlan")}</CardTitle>
            <CardDescription>{t("billing.proPlanDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$12<span className="text-base font-normal text-muted-foreground">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {proPlanFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("billing.comparison")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("billing.feature")}</TableHead>
                <TableHead>{t("billing.freeCol")}</TableHead>
                <TableHead>{t("billing.proCol")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((f) => (
                <TableRow key={f.nameKey}>
                  <TableCell>{t(f.nameKey)}</TableCell>
                  <TableCell>
                    {typeof f.free === "boolean" ? (
                      f.free ? <Check className="size-4 text-emerald-400" /> : "—"
                    ) : f.free}
                  </TableCell>
                  <TableCell>
                    {typeof f.pro === "boolean" ? (
                      f.pro ? <Check className="size-4 text-emerald-400" /> : "—"
                    ) : f.pro}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}