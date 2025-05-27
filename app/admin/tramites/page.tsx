"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, DollarSign } from "lucide-react"

interface Tramite {
  id: number
  nombre: string
  descripcion: string
  requisitos: string
  costo: number
  tiempo_estimado: string
  categoria: string
  documento_url?: string
  imagen_url?: string
  activo: boolean
}

export default function AdminTramites() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [tramites, setTramites] = useState<Tramite[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTramite, setEditingTramite] = useState<Tramite | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    requisitos: "",
    costo: 0,
    tiempo_estimado: "",
    categoria: "",
    documento_url: "",
    imagen_url: "",
    activo: true,
  })

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
      fetchTramites()
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

  const fetchTramites = async () => {
    try {
      setLoadingData(true)
      const response = await fetch("/api/tramites")
      const result = await response.json()

      if (result.success) {
        setTramites(result.data)
      } else {
        console.error("Error fetching tramites:", result.message)
        alert("Error al cargar trámites: " + result.message)
      }
    } catch (error) {
      console.error("Error fetching tramites:", error)
      alert("Error de conexión al cargar trámites")
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingTramite ? `/api/tramites/${editingTramite.id}` : "/api/tramites"
      const method = editingTramite ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchTramites()
        resetForm()
        alert(editingTramite ? "Trámite actualizado exitosamente" : "Trámite creado exitosamente")
      } else {
        alert("Error: " + result.message)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al procesar la solicitud")
    }
  }

  const handleEdit = (tramite: Tramite) => {
    setEditingTramite(tramite)
    setFormData({
      nombre: tramite.nombre,
      descripcion: tramite.descripcion,
      requisitos: tramite.requisitos,
      costo: tramite.costo,
      tiempo_estimado: tramite.tiempo_estimado,
      categoria: tramite.categoria,
      documento_url: tramite.documento_url || "",
      imagen_url: tramite.imagen_url || "",
      activo: tramite.activo,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este trámite?")) return

    try {
      const response = await fetch(`/api/tramites/${id}`, { method: "DELETE" })
      const result = await response.json()

      if (result.success) {
        await fetchTramites()
        alert("Trámite eliminado exitosamente")
      } else {
        alert("Error: " + result.message)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar el trámite")
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      requisitos: "",
      costo: 0,
      tiempo_estimado: "",
      categoria: "",
      documento_url: "",
      imagen_url: "",
      activo: true,
    })
    setEditingTramite(null)
    setShowForm(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Trámites</h1>
            <p className="text-gray-600">Administra los trámites y servicios municipales</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Trámite
            </Button>
            <Button asChild variant="outline">
              <a href="/admin/dashboard">← Volver al Panel</a>
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingTramite ? "Editar Trámite" : "Nuevo Trámite"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Trámite</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Licencias">Licencias</SelectItem>
                        <SelectItem value="Certificados">Certificados</SelectItem>
                        <SelectItem value="Permisos">Permisos</SelectItem>
                        <SelectItem value="Paz y Salvos">Paz y Salvos</SelectItem>
                        <SelectItem value="Otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requisitos">Requisitos</Label>
                  <Textarea
                    id="requisitos"
                    value={formData.requisitos}
                    onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                    rows={4}
                    placeholder="Separa cada requisito con una nueva línea"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="costo">Costo (COP)</Label>
                    <Input
                      id="costo"
                      type="number"
                      value={formData.costo}
                      onChange={(e) => setFormData({ ...formData, costo: Number(e.target.value) })}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tiempo_estimado">Tiempo Estimado</Label>
                    <Input
                      id="tiempo_estimado"
                      value={formData.tiempo_estimado}
                      onChange={(e) => setFormData({ ...formData, tiempo_estimado: e.target.value })}
                      placeholder="ej: 3 días hábiles"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documento_url">URL del Formulario</Label>
                    <Input
                      id="documento_url"
                      value={formData.documento_url}
                      onChange={(e) => setFormData({ ...formData, documento_url: e.target.value })}
                      placeholder="https://ejemplo.com/formulario.pdf"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imagen_url">URL de la Imagen</Label>
                  <Input
                    id="imagen_url"
                    value={formData.imagen_url}
                    onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {formData.imagen_url && (
                    <div className="mt-2">
                      <img
                        src={formData.imagen_url || "/placeholder.svg"}
                        alt="Vista previa"
                        className="w-32 h-32 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=128&width=128"
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="activo"
                    checked={formData.activo}
                    onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                  />
                  <Label htmlFor="activo">Trámite Activo</Label>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingTramite ? "Actualizar" : "Crear"} Trámite
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de trámites */}
        <div className="grid gap-6">
          {loadingData ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando trámites...</p>
            </div>
          ) : tramites.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay trámites registrados</p>
            </div>
          ) : (
            tramites.map((tramite) => (
              <Card key={tramite.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4 flex-1">
                      {tramite.imagen_url && (
                        <img
                          src={tramite.imagen_url || "/placeholder.svg"}
                          alt={tramite.nombre}
                          className="w-24 h-24 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=96&width=96"
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">{tramite.nombre}</h3>
                          <Badge className="bg-blue-500">{tramite.categoria}</Badge>
                          <Badge variant={tramite.activo ? "default" : "secondary"}>
                            {tramite.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{tramite.descripcion}</p>

                        <div className="grid md:grid-cols-3 gap-4 mb-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                            <span>{tramite.costo === 0 ? "Gratuito" : formatCurrency(tramite.costo)}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Tiempo:</strong> {tramite.tiempo_estimado}
                          </div>
                          {tramite.documento_url && (
                            <div className="text-sm text-blue-600">
                              <a href={tramite.documento_url} target="_blank" rel="noopener noreferrer">
                                Ver Formulario
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <h4 className="font-semibold text-gray-800 mb-1">Requisitos:</h4>
                          <div className="text-sm text-gray-600">
                            {tramite.requisitos.split("\n").map((req, index) => (
                              <p key={index}>• {req}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(tramite)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(tramite.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
