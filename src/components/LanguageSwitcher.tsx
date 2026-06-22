import type { Locale } from "@/i18n/types"
import { localeLabels } from "@/i18n"
import { useI18n } from "@/contexts/I18nContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n()

  return (
    <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
      <SelectTrigger className={className ?? "w-36"}>
        <SelectValue placeholder={t("common.language")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="uk">{localeLabels.uk}</SelectItem>
        <SelectItem value="en">{localeLabels.en}</SelectItem>
        <SelectItem value="cs">{localeLabels.cs}</SelectItem>
      </SelectContent>
    </Select>
  )
}