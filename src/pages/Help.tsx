import { useI18n } from "@/contexts/I18nContext"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const FAQ_KEYS = [
  { q: "help.faq1q", a: "help.faq1a" },
  { q: "help.faq2q", a: "help.faq2a" },
  { q: "help.faq3q", a: "help.faq3a" },
  { q: "help.faq4q", a: "help.faq4a" },
  { q: "help.faq5q", a: "help.faq5a" },
  { q: "help.faq6q", a: "help.faq6a" },
  { q: "help.faq7q", a: "help.faq7a" },
] as const

const STEP_KEYS = [
  "help.step1",
  "help.step2",
  "help.step3",
  "help.step4",
  "help.step5",
] as const

export function Help() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("help.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("help.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("help.gettingStarted")}</CardTitle>
          <CardDescription>{t("help.gettingStartedDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {STEP_KEYS.map((stepKey, i) => (
            <p key={stepKey}>
              <strong className="text-foreground">{i + 1}.</strong> {t(stepKey)}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("help.faq")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_KEYS.map(({ q, a }, i) => (
              <AccordionItem key={q} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left">{t(q)}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{t(a)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}