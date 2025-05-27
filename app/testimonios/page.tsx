"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star } from "lucide-react"

interface Testimonio {
  id: string
  nombre: string
  mensaje: string
  calificacion: number
  created_at: string
}

export default function TestimoniosPage() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
    calificacion: 5,
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchTestimonios()
  }, [])

  const fetchTestimonios = async () => {
    try {
      const response = await fetch("/api/testimonios?estado=aprobado")
      const data = await response.json()

      if (data.success) {
        setTestimonios(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching testimonios:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/testimonios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage("¡Testimonio enviado exitosamente! Será revisado antes de publicarse.")
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          mensaje: "",
          calificacion: 5,
        })
      } else {
        setMessage(`Error: ${data.message}`)
      }
    } catch (error) {
      setMessage("Error de conexión. Intenta nuevamente.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Testimonios Ciudadanos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comparte tu experiencia con los servicios de la Alcaldía de Tibirita
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle>Enviar Testimonio</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                  <Label htmlFor="telefono">Teléfono (Opcional)</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calificacion">Calificación</Label>
                  <Select
                    value={formData.calificacion.toString()}
                    onValueChange={(value) => setFormData({ ...formData, calificacion: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ Muy Bueno</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ Bueno</SelectItem>
                      <SelectItem value="2">⭐⭐ Regular</SelectItem>
                      <SelectItem value="1">⭐ Malo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensaje">Mensaje</Label>
                  <Textarea
                    id="mensaje"
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                {message && (
                  <div className={`text-sm ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                    {message}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar Testimonio"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de testimonios */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Testimonios Publicados</h2>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Cargando testimonios...</p>
              </div>
            ) : testimonios.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay testimonios publicados aún.</p>
              </div>
            ) : (
              testimonios.map((testimonio) => (
                <Card key={testimonio.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{testimonio.nombre}</h3>
                      <div className="flex">{renderStars(testimonio.calificacion)}</div>
                    </div>
                    <p className="text-gray-600 mb-2">{testimonio.mensaje}</p>
                    <p className="text-sm text-gray-400">{new Date(testimonio.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
