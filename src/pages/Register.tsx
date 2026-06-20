import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Briefcase, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getPasswordStrength } from "@/lib/crypto"
import { registerSchema } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const strength = getPasswordStrength(form.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = registerSchema.safeParse({
      ...form,
      acceptTerms: form.acceptTerms ? true : undefined,
    })
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]?.toString() ?? "form"] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    const ok = await register(parsed.data.fullName, parsed.data.email, parsed.data.password)
    setLoading(false)
    if (ok) navigate("/app/dashboard", { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary">
            <Briefcase className="size-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">Start tracking your job search today</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>All data is stored locally in your browser</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <Button type="button" variant="ghost" size="icon-xs" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
                {form.password && (
                  <div className="space-y-1">
                    <Progress value={strength.score} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">Strength: {strength.label}</p>
                  </div>
                )}
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Confirm Password</Label>
                <Input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={form.acceptTerms}
                  onCheckedChange={(c) => setForm({ ...form, acceptTerms: c === true })}
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-snug text-muted-foreground">
                  I agree to the Terms of Service and Privacy Policy (demo mock)
                </Label>
              </div>
              {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}