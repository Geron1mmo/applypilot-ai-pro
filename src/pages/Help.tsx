import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const faqs = [
  {
    q: "How does ApplyPilot store my data?",
    a: "All data is stored in your browser's localStorage. Nothing is sent to external servers. Your applications, documents, and profile exist only on your device.",
  },
  {
    q: "How does the CV Analyzer work?",
    a: "The CV Analyzer uses a local skill-matching algorithm. It compares keywords and tech skills from your CV against the job description. No AI APIs or external services are used.",
  },
  {
    q: "How do I use the demo account?",
    a: "On the login page, click 'Try Demo Account' or sign in with email demoapplypilot.local and password Demo12345!. The demo comes pre-loaded with sample applications and documents.",
  },
  {
    q: "How do I backup my data?",
    a: "Go to Settings → Data Management → Export all data as JSON. Save the file somewhere safe. To restore, use Import data from JSON on the same page.",
  },
  {
    q: "Is the authentication secure?",
    a: "Passwords are hashed locally using Web Crypto API with per-user salts. However, this is a portfolio demo — not production-grade security. See SECURITY.md for details.",
  },
  {
    q: "Can I deploy this to Vercel?",
    a: "Yes! The app is a static SPA deployable to Vercel's free tier. Push to GitHub, import in Vercel, and deploy. All functionality still runs client-side in the browser.",
  },
  {
    q: "What happens if I clear browser data?",
    a: "All ApplyPilot data will be permanently deleted. Always export a backup before clearing browser storage or using incognito mode.",
  },
]

export function Help() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Help & FAQ</h1>
        <p className="text-sm text-muted-foreground">Guides and frequently asked questions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Getting Started</CardTitle>
          <CardDescription>Quick guide to using ApplyPilot AI Pro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong className="text-foreground">1. Create an account</strong> — Register with your name, email, and password. Or use the demo account.</p>
          <p><strong className="text-foreground">2. Add applications</strong> — Go to Applications and add job postings you&apos;re tracking.</p>
          <p><strong className="text-foreground">3. Use the Kanban board</strong> — Move applications through pipeline stages.</p>
          <p><strong className="text-foreground">4. Analyze your CV</strong> — Paste your resume and a job description to get a match score.</p>
          <p><strong className="text-foreground">5. Review analytics</strong> — Track conversion rates and optimize your search.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}