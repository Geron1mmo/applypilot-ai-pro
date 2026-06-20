import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { toast } from "sonner"
import type { User } from "@/types"
import { generateSalt, generateToken, hashPassword, verifyPassword } from "@/lib/crypto"
import {
  createDemoApplications,
  createDemoDocuments,
  createDemoUser,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  DEMO_USER_ID,
} from "@/lib/demoData"
import {
  clearAllData,
  getSession,
  getSettings,
  getUserByEmail,
  getUserById,
  loadData,
  saveData,
  saveUser,
  setSession,
} from "@/lib/storage"

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (fullName: string, email: string, password: string) => Promise<boolean>
  loginDemo: () => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function ensureDemoAccount(): Promise<void> {
  const data = loadData()
  const existing = data.users.find((u) => u.email === DEMO_EMAIL)
  if (existing) return

  const salt = generateSalt()
  const passwordHash = await hashPassword(DEMO_PASSWORD, salt)
  const demoUser = createDemoUser(passwordHash, salt)

  data.users.push(demoUser)
  data.applications.push(...createDemoApplications())
  data.documents.push(...createDemoDocuments())
  data.settings[DEMO_USER_ID] = getSettings(DEMO_USER_ID)
  saveData(data)
}

function createSession(userId: string) {
  const session = {
    token: generateToken(),
    userId,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  }
  setSession(session)
  return session
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const refreshUser = useCallback(() => {
    const session = getSession()
    if (!session) {
      setUser(null)
      return
    }
    const found = getUserById(session.userId)
    setUser(found ?? null)
  }, [])

  const resetInactivityTimer = useCallback(() => {
    if (!user) return
    const minutes = getSettings(user.id).autoLogoutMinutes
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    if (minutes <= 0) return

    inactivityTimer.current = setTimeout(
      () => {
        setSession(null)
        setUser(null)
        toast.info("Session expired due to inactivity")
      },
      minutes * 60 * 1000
    )
  }, [user])

  useEffect(() => {
    ensureDemoAccount().then(() => {
      const session = getSession()
      if (session) {
        const found = getUserById(session.userId)
        if (found) {
          setUser(found)
          const updated = { ...session, lastActivity: new Date().toISOString() }
          setSession(updated)
        } else {
          setSession(null)
        }
      }
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!user) return
    resetInactivityTimer()

    const events = ["mousedown", "keydown", "scroll", "touchstart"] as const
    const handler = () => {
      const session = getSession()
      if (session) {
        setSession({ ...session, lastActivity: new Date().toISOString() })
      }
      resetInactivityTimer()
    }
    events.forEach((e) => window.addEventListener(e, handler))
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler))
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    }
  }, [user, resetInactivityTimer])

  const login = useCallback(async (email: string, password: string) => {
    const found = getUserByEmail(email)
    if (!found) {
      toast.error("No account found with this email")
      return false
    }
    const valid = await verifyPassword(password, found.salt, found.passwordHash)
    if (!valid) {
      toast.error("Incorrect password")
      return false
    }
    createSession(found.id)
    setUser(found)
    toast.success(`Welcome back, ${found.fullName.split(" ")[0]}!`)
    return true
  }, [])

  const register = useCallback(
    async (fullName: string, email: string, password: string) => {
      if (getUserByEmail(email)) {
        toast.error("An account with this email already exists")
        return false
      }
      const salt = generateSalt()
      const passwordHash = await hashPassword(password, salt)
      const newUser: User = {
        id: crypto.randomUUID(),
        fullName,
        email,
        passwordHash,
        salt,
        role: "user",
        createdAt: new Date().toISOString(),
        profile: {
          jobTargetTitle: "",
          location: "",
          preferredWorkMode: "remote",
          bio: "",
          skills: [],
        },
      }
      saveUser(newUser)
      createSession(newUser.id)
      setUser(newUser)
      toast.success("Account created successfully!")
      return true
    },
    []
  )

  const loginDemo = useCallback(async () => {
    await ensureDemoAccount()
    const demo = getUserByEmail(DEMO_EMAIL)
    if (!demo) {
      toast.error("Demo account unavailable")
      return false
    }
    createSession(demo.id)
    setUser(demo)
    toast.success("Logged in with demo account")
    return true
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    setUser(null)
    toast.success("Logged out")
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      saveUser(updated)
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginDemo,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export { clearAllData }