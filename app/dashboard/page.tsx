"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }

      // Redirigir según el rol del usuario
      switch (user.role) {
        case "administrador":
          router.push("/admin/dashboard")
          break
        case "analitico":
          router.push("/dashboard/analitico")
          break
        case "usuario":
        default:
          router.push("/dashboard/usuario")
          break
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return null
}
