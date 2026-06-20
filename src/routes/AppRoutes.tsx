import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { ProtectedRoute } from "@/routes/ProtectedRoute"
import { Landing } from "@/pages/Landing"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { Dashboard } from "@/pages/Dashboard"
import { Applications } from "@/pages/Applications"
import { Kanban } from "@/pages/Kanban"
import { CVAnalyzer } from "@/pages/CVAnalyzer"
import { Documents } from "@/pages/Documents"
import { Analytics } from "@/pages/Analytics"
import { Profile } from "@/pages/Profile"
import { Settings } from "@/pages/Settings"
import { Security } from "@/pages/Security"
import { Billing } from "@/pages/Billing"
import { Help } from "@/pages/Help"

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="cv-analyzer" element={<CVAnalyzer />} />
          <Route path="documents" element={<Documents />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="security" element={<Security />} />
          <Route path="billing" element={<Billing />} />
          <Route path="help" element={<Help />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}