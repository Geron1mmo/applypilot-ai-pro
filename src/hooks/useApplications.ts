import { useCallback, useEffect, useState } from "react"
import type { Application } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import {
  deleteApplication as removeApp,
  getApplications,
  saveApplication,
} from "@/lib/storage"

export function useApplications() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])

  const refresh = useCallback(() => {
    if (!user) {
      setApplications([])
      return
    }
    setApplications(
      getApplications(user.id).sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    )
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

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