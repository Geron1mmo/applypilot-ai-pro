import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"
import { AppRoutes } from "@/routes/AppRoutes"
import { TooltipProvider } from "@/components/ui/tooltip"

function ThemedApp() {
  const { user } = useAuth()
  return (
    <ThemeProvider userId={user?.id}>
      <TooltipProvider>
        <AppRoutes />
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ThemedApp />
    </AuthProvider>
  )
}