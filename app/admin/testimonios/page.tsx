"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Trash2, Star } from "lucide-react"

interface Testimonio {
  id: string
  nombre: string
  email: string
  telefono?: string
  mensaje: string
  calificacion: number
  estado: "pendiente" | "aprobado" | "rechazado"
  created_at: string
  updated_at: string
}

export default function AdminTestimonios() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [testimonios, setTestimonios] = useState<Testimonio[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [filter, setFilter] = useState("todos")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user && user.role !== "administrador") {
      router.push("/")
      return
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === "administrador") {
      fetchTestimonios()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user || user.role !== "administrador") {
    return null
  }

  const fetchTestimonios = async () => {
    try {
      const response = await fetch("/api/testimonios")
      const data = await response.json()
      if (data.success) {
        setTestimonios(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching testimonios:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const updateTestimonioStatus = async (id: string, estado: string) => {
    try {
      const response = await fetch(`/api/testimonios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      })

      if (response.ok) {
        await fetchTestimonios()
      }
    } catch (error) {
      console.error("Error updating testimonio:", error)
    }
  }

  const deleteTestimonio = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este testimonio?")) {
      try {
        const response = await fetch(`/api/testimonios/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchTestimonios()
        }
      } catch (error) {
        console.error("Error deleting testimonio:", error)
      }
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "aprobado":
        return <Badge className="bg-green-500">Aprobado</Badge>
      case "rechazado":
        return <Badge className="bg-red-500">Rechazado</Badge>
      default:
        return <Badge className="bg-yellow-500">Pendiente</Badge>
    }
  }

  const filteredTestimonios = testimonios.filter((testimonio) => {
    if (filter === "todos") return true
    return testimonio.estado === filter
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Testimonios</h1>
            <p className="text-gray-600">Moderar y aprobar testimonios ciudadanos</p>
          </div>
          <Button asChild variant="outline">
            <a href="/admin/dashboard">← Volver al Panel</a>
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtrar Testimonios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="aprobado">Aprobados</SelectItem>
                  <SelectItem value="rechazado">Rechazados</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-gray-600">
                Mostrando {filteredTestimonios.length} de {testimonios.length} testimonios
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de testimonios */}
        <div className="space-y-6">
          {loadingData ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando testimonios...</p>
            </div>
          ) : filteredTestimonios.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay testimonios para mostrar</p>
            </div>
          ) : (
            filteredTestimonios.map((testimonio) => (
              <Card key={testimonio.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{testimonio.nombre}</h3>
                        {getStatusBadge(testimonio.estado)}
                      </div>
                      <div className="flex items-center mb-2">
                        {renderStars(testimonio.calificacion)}
                        <span className="ml-2 text-sm text-gray-600">({testimonio.calificacion}/5)</span>
                      </div>
                      <p className="text-gray-700 mb-3">{testimonio.mensaje}</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>
                          <strong>Email:</strong> {testimonio.email}
                        </p>
                        {testimonio.telefono && (
                          <p>
                            <strong>Teléfono:</strong> {testimonio.telefono}
                          </p>
                        )}
                        <p>
                          <strong>Fecha:</strong> {new Date(testimonio.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {testimonio.estado === "pendiente" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateTestimonioStatus(testimonio.id, "aprobado")}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => updateTestimonioStatus(testimonio.id, "rechazado")}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </Button>
                      </>
                    )}

                    {testimonio.estado === "aprobado" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => updateTestimonioStatus(testimonio.id, "rechazado")}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rechazar
                      </Button>
                    )}

                    {testimonio.estado === "rechazado" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateTestimonioStatus(testimonio.id, "aprobado")}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aprobar
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteTestimonio(testimonio.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
