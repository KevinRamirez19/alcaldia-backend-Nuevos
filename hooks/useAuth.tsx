"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import type { User } from "@/types/database"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<any>
  register: (email: string, password: string, fullName: string, role?: string) => Promise<any>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem("tibirita_user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("tibirita_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (result.success && result.user) {
        setUser(result.user)
        localStorage.setItem("tibirita_user", JSON.stringify(result.user))
      }

      return result
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Error de conexión" }
    }
  }

  const register = async (email: string, password: string, fullName: string, role = "usuario") => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, fullName, role }),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Register error:", error)
      return { success: false, message: "Error de conexión" }
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("tibirita_user")
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
