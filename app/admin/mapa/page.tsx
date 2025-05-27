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
import { Pencil, Trash2, Plus, MapPin } from "lucide-react"

interface UbicacionMapa {
  id: number
  nombre: string
  descripcion: string
  direccion: string
  telefono: string
  categoria: string
  lat: number
  lng: number
  imagen_url?: string
  activa: boolean
}

export default function AdminMapa() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [ubicaciones, setUbicaciones] = useState<UbicacionMapa[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUbicacion, setEditingUbicacion] = useState<UbicacionMapa | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    telefono: "",
    categoria: "",
    lat: 0,
    lng: 0,
    imagen_url: "",
    activa: true,
  })

  const categorias = ["Gobierno", "Salud", "Educación", "Recreación", "Religioso", "Seguridad", "Turismo"]

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
      fetchUbicaciones()
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

  const fetchUbicaciones = async () => {
    try {
      setLoadingData(true)
      const response = await fetch("/api/ubicaciones-mapa")
      if (!response.ok) {
        throw new Error("Error al cargar ubicaciones")
      }
      const data = await response.json()
      setUbicaciones(data)
    } catch (error) {
      console.error("Error fetching ubicaciones:", error)
      alert("Error al cargar las ubicaciones")
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingUbicacion ? "PUT" : "POST"
      const url = editingUbicacion ? `/api/ubicaciones-mapa/${editingUbicacion.id}` : "/api/ubicaciones-mapa"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error al guardar la ubicación")
      }

      alert(editingUbicacion ? "Ubicación actualizada exitosamente" : "Ubicación creada exitosamente")
      resetForm()
      await fetchUbicaciones()
    } catch (error) {
      console.error("Error saving ubicacion:", error)
      alert("Error al guardar la ubicación")
    }
  }

  const handleEdit = (ubicacion: UbicacionMapa) => {
    setEditingUbicacion(ubicacion)
    setFormData({
      nombre: ubicacion.nombre,
      descripcion: ubicacion.descripcion,
      direccion: ubicacion.direccion,
      telefono: ubicacion.telefono,
      categoria: ubicacion.categoria,
      lat: ubicacion.lat,
      lng: ubicacion.lng,
      imagen_url: ubicacion.imagen_url || "",
      activa: ubicacion.activa,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta ubicación?")) {
      try {
        const response = await fetch(`/api/ubicaciones-mapa/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Error al eliminar la ubicación")
        }

        alert("Ubicación eliminada exitosamente")
        await fetchUbicaciones()
      } catch (error) {
        console.error("Error deleting ubicacion:", error)
        alert("Error al eliminar la ubicación")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      direccion: "",
      telefono: "",
      categoria: "",
      lat: 0,
      lng: 0,
      imagen_url: "",
      activa: true,
    })
    setEditingUbicacion(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión del Mapa</h1>
            <p className="text-gray-600">Administra ubicaciones y puntos de interés del municipio</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={() => setShowForm(true)} className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Ubicación
            </Button>
            <Button asChild variant="outline">
              <a href="/admin/dashboard">← Volver al Panel</a>
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingUbicacion ? "Editar Ubicación" : "Nueva Ubicación"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
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
                        {categorias.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat">Latitud</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitud</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: Number(e.target.value) })}
                      required
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
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="activa"
                    checked={formData.activa}
                    onCheckedChange={(checked) => setFormData({ ...formData, activa: checked })}
                  />
                  <Label htmlFor="activa">Ubicación Activa</Label>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                    {editingUbicacion ? "Actualizar" : "Crear"} Ubicación
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de ubicaciones */}
        <div className="grid gap-6">
          {loadingData ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando ubicaciones...</p>
            </div>
          ) : ubicaciones.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay ubicaciones registradas</p>
            </div>
          ) : (
            ubicaciones.map((ubicacion) => (
              <Card key={ubicacion.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{ubicacion.nombre}</h3>
                        <Badge className="bg-teal-500">{ubicacion.categoria}</Badge>
                        <Badge variant={ubicacion.activa ? "default" : "secondary"}>
                          {ubicacion.activa ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{ubicacion.descripcion}</p>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-red-500" />
                          <span>{ubicacion.direccion}</span>
                        </div>
                        <div>
                          <strong>Teléfono:</strong> {ubicacion.telefono}
                        </div>
                        <div>
                          <strong>Coordenadas:</strong> {ubicacion.lat}, {ubicacion.lng}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(ubicacion)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(ubicacion.id)}
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
