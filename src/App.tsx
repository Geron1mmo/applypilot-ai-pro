import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import { I18nProvider } from "@/contexts/I18nContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"
import { AppRoutes } from "@/routes/AppRoutes"
import { TooltipProvider } from "@/components/ui/tooltip"

function ThemedApp() {
  const { user } = useAuth()
  return (
    <I18nProvider userId={user?.id}>
      <ThemeProvider userId={user?.id}>
        <TooltipProvider>
          <AppRoutes />
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ThemedApp />
    </AuthProvider>
  )
}