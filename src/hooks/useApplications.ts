import { useCallback, useState } from "react"
import type { Application } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import {
  deleteApplication as removeApp,
  getApplications,
  saveApplication,
} from "@/lib/storage"

function sortApplications(apps: Application[]) {
  return apps.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

function loadApplications(userId: string) {
  return sortApplications(getApplications(userId))
}

export function useApplications() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [prevUserId, setPrevUserId] = useState(user?.id)

  if (user?.id !== prevUserId) {
    setPrevUserId(user?.id)
    setApplications(user ? loadApplications(user.id) : [])
  }

  const refresh = useCallback(() => {
    if (!user) {
      setApplications([])
      return
    }
    setApplications(loadApplications(user.id))
  }, [user])

  const upsert = useCallback(
    (app: Application) => {
      saveApplication(app)
      refresh()
    },
    [refresh]
  )

  const remove = useCallback(
    (id: string) => {
      removeApp(id)
      refresh()
    },
    [refresh]
  )

  return { applications, refresh, upsert, remove }
}