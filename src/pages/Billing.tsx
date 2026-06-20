import { Check, CreditCard } from "lucide-react"
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

const features = [
  { name: "Job applications", free: "Unlimited", pro: "Unlimited" },
  { name: "CV analyzer", free: true, pro: true },
  { name: "Kanban board", free: true, pro: true },
  { name: "Analytics", free: true, pro: true },
  { name: "Document storage", free: true, pro: true },
  { name: "Cloud sync", free: false, pro: "Coming soon" },
  { name: "Team collaboration", free: false, pro: "Coming soon" },
  { name: "AI cover letters", free: false, pro: "Coming soon" },
]

export function Billing() {
  const { applications } = useApplications()

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-muted-foreground">Plan and usage overview</p>
      </div>

      <Alert>
        <CreditCard className="size-4" />
        <AlertTitle>Portfolio demo — no real billing</AlertTitle>
        <AlertDescription>
          This page is a UI mockup for portfolio purposes. No payments are processed.
          ApplyPilot AI Pro is completely free and runs locally.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{applications.length}</p>
            <p className="text-xs text-muted-foreground">Applications tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">∞</p>
            <p className="text-xs text-muted-foreground">CV analyses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">$0</p>
            <p className="text-xs text-muted-foreground">Monthly cost</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/30">
          <CardHeader>
            <Badge className="w-fit">Current Plan</Badge>
            <CardTitle>Free Local Plan</CardTitle>
            <CardDescription>Everything you need, stored locally</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$0<span className="text-base font-normal text-muted-foreground">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm">
              {["Unlimited applications", "Local CV analyzer", "Full analytics", "Export/import"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-400" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <Badge variant="secondary" className="w-fit">Coming Soon</Badge>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>Future cloud features (not available)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$12<span className="text-base font-normal text-muted-foreground">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {["Cloud sync", "AI cover letters", "Team sharing", "Priority support"].map((f) => (
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
          <CardTitle className="text-base">Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Free Local</TableHead>
                <TableHead>Pro (Coming Soon)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((f) => (
                <TableRow key={f.name}>
                  <TableCell>{f.name}</TableCell>
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