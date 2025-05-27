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
import { Pencil, Trash2, Plus, MapPin, Star } from "lucide-react"

interface SitioTuristico {
  id: number
  nombre: string
  descripcion: string
  categoria: string
  ubicacion: string
  horarios: string
  precio: string
  calificacion: number
  imagen_url: string
  destacado: boolean
  activo: boolean
}

export default function AdminSitiosTuristicos() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sitios, setSitios] = useState<SitioTuristico[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSitio, setEditingSitio] = useState<SitioTuristico | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    ubicacion: "",
    horarios: "",
    precio: "",
    calificacion: 5,
    imagen_url: "",
    destacado: false,
    activo: true,
  })

  const categorias = ["Naturaleza", "Patrimonio", "Arqueología", "Bienestar", "Cultura"]

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
      fetchSitios()
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

  const fetchSitios = async () => {
    try {
      setLoadingData(true)
      const response = await fetch("/api/sitios-turisticos")
      if (!response.ok) {
        throw new Error("Error al cargar sitios turísticos")
      }
      const data = await response.json()
      setSitios(data)
    } catch (error) {
      console.error("Error fetching sitios:", error)
      alert("Error al cargar los sitios turísticos")
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingSitio ? "PUT" : "POST"
      const url = editingSitio ? `/api/sitios-turisticos/${editingSitio.id}` : "/api/sitios-turisticos"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error al guardar el sitio turístico")
      }

      alert(editingSitio ? "Sitio turístico actualizado exitosamente" : "Sitio turístico creado exitosamente")
      resetForm()
      await fetchSitios()
    } catch (error) {
      console.error("Error saving sitio:", error)
      alert("Error al guardar el sitio turístico")
    }
  }

  const handleEdit = (sitio: SitioTuristico) => {
    setEditingSitio(sitio)
    setFormData({
      nombre: sitio.nombre,
      descripcion: sitio.descripcion,
      categoria: sitio.categoria,
      ubicacion: sitio.ubicacion,
      horarios: sitio.horarios,
      precio: sitio.precio,
      calificacion: sitio.calificacion,
      imagen_url: sitio.imagen_url,
      destacado: sitio.destacado,
      activo: sitio.activo,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este sitio turístico?")) {
      try {
        const response = await fetch(`/api/sitios-turisticos/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Error al eliminar el sitio turístico")
        }

        alert("Sitio turístico eliminado exitosamente")
        await fetchSitios()
      } catch (error) {
        console.error("Error deleting sitio:", error)
        alert("Error al eliminar el sitio turístico")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      categoria: "",
      ubicacion: "",
      horarios: "",
      precio: "",
      calificacion: 5,
      imagen_url: "",
      destacado: false,
      activo: true,
    })
    setEditingSitio(null)
    setShowForm(false)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Sitios Turísticos</h1>
            <p className="text-gray-600">Administra los lugares turísticos del municipio</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={() => setShowForm(true)} className="bg-pink-600 hover:bg-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Sitio
            </Button>
            <Button asChild variant="outline">
              <a href="/admin/dashboard">← Volver al Panel</a>
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingSitio ? "Editar Sitio Turístico" : "Nuevo Sitio Turístico"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Sitio</Label>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <Input
                      id="ubicacion"
                      value={formData.ubicacion}
                      onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horarios">Horarios</Label>
                    <Input
                      id="horarios"
                      value={formData.horarios}
                      onChange={(e) => setFormData({ ...formData, horarios: e.target.value })}
                      placeholder="ej: 8:00 AM - 5:00 PM"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio</Label>
                    <Input
                      id="precio"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      placeholder="ej: Entrada libre o $10,000"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calificacion">Calificación (1-5)</Label>
                    <Select
                      value={formData.calificacion.toString()}
                      onValueChange={(value) => setFormData({ ...formData, calificacion: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                        <SelectItem value="2">⭐⭐ (2)</SelectItem>
                        <SelectItem value="1">⭐ (1)</SelectItem>
                      </SelectContent>
                    </Select>
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
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="destacado"
                      checked={formData.destacado}
                      onCheckedChange={(checked) => setFormData({ ...formData, destacado: checked })}
                    />
                    <Label htmlFor="destacado">Sitio Destacado</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="activo"
                      checked={formData.activo}
                      onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                    />
                    <Label htmlFor="activo">Sitio Activo</Label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                    {editingSitio ? "Actualizar" : "Crear"} Sitio
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de sitios */}
        <div className="grid gap-6">
          {loadingData ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando sitios turísticos...</p>
            </div>
          ) : sitios.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay sitios turísticos registrados</p>
            </div>
          ) : (
            sitios.map((sitio) => (
              <Card key={sitio.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{sitio.nombre}</h3>
                        <Badge className="bg-green-500">{sitio.categoria}</Badge>
                        {sitio.destacado && <Badge className="bg-yellow-500">Destacado</Badge>}
                        <Badge variant={sitio.activo ? "default" : "secondary"}>
                          {sitio.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div className="flex items-center mb-2">
                        {renderStars(sitio.calificacion)}
                        <span className="ml-2 text-sm text-gray-600">({sitio.calificacion}/5)</span>
                      </div>
                      <p className="text-gray-600 mb-3">{sitio.descripcion}</p>

                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-red-500" />
                          <span>{sitio.ubicacion}</span>
                        </div>
                        <div>
                          <strong>Horarios:</strong> {sitio.horarios}
                        </div>
                        <div>
                          <strong>Precio:</strong> {sitio.precio}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(sitio)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(sitio.id)}
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
