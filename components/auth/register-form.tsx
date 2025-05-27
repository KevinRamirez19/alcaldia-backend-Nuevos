"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "usuario",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await register(formData.email, formData.password, formData.fullName, formData.role)

      if (result.success) {
        setSuccess(result.message)
        setTimeout(() => router.push("/login"), 2000)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Registrarse</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre Completo</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usuario">Usuario</SelectItem>
                <SelectItem value="analitico">Analítico</SelectItem>
                <SelectItem value="administrador">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          {success && <div className="text-green-600 text-sm">{success}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
