import { NavLink } from "react-router-dom"
import {
  BarChart3,
  Briefcase,
  CreditCard,
  FileText,
  HelpCircle,
  Kanban,
  LayoutDashboard,
  LogOut,
  ScanSearch,
  Settings,
  Shield,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/applications", label: "Applications", icon: Briefcase },
  { to: "/app/kanban", label: "Kanban", icon: Kanban },
  { to: "/app/cv-analyzer", label: "CV Analyzer", icon: ScanSearch },
  { to: "/app/documents", label: "Documents", icon: FileText },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/profile", label: "Profile", icon: User },
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/security", label: "Security", icon: Shield },
  { to: "/app/billing", label: "Billing", icon: CreditCard },
  { to: "/app/help", label: "Help", icon: HelpCircle },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Briefcase className="size-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">ApplyPilot</p>
          <p className="text-xs text-muted-foreground">AI Pro</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        {user && (
          <div className="mb-2 px-3">
            <p className="truncate text-sm font-medium">{user.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <Separator className="mb-2" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={() => {
            logout()
            onNavigate?.()
          }}
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}