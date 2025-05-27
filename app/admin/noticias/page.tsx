"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Noticia {
  id: number
  titulo: string
  contenido: string
  autor: string
  categoria: string
  destacada: boolean
  activa: boolean
  fecha_publicacion: string
  imagen_url?: string
}

export default function AdminNoticias() {
  const { user, loading } = useAuth()
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    autor: "",
    categoria: "general",
    destacada: false,
    imagen_url: "",
  })

  useEffect(() => {
    fetchNoticias()
  }, [])

  const fetchNoticias = async () => {
    try {
      const response = await fetch("/api/noticias")
      const result = await response.json()
      if (result.success) {
        setNoticias(result.data)
      }
    } catch (error) {
      console.error("Error fetching noticias:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingNoticia ? `/api/noticias/${editingNoticia.id}` : "/api/noticias"
      const method = editingNoticia ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchNoticias()
        setIsCreating(false)
        setEditingNoticia(null)
        setFormData({ titulo: "", contenido: "", autor: "", categoria: "general", destacada: false, imagen_url: "" })
        alert(editingNoticia ? "Noticia actualizada exitosamente" : "Noticia creada exitosamente")
      } else {
        alert("Error: " + result.message)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al procesar la solicitud")
    }
  }

  const handleEdit = (noticia: Noticia) => {
    setEditingNoticia(noticia)
    setFormData({
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      autor: noticia.autor,
      categoria: noticia.categoria,
      destacada: noticia.destacada,
      imagen_url: noticia.imagen_url || "",
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta noticia?")) return

    try {
      const response = await fetch(`/api/noticias/${id}`, { method: "DELETE" })
      const result = await response.json()

      if (result.success) {
        await fetchNoticias()
        alert("Noticia eliminada exitosamente")
      } else {
        alert("Error: " + result.message)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar la noticia")
    }
  }

  const resetForm = () => {
    setIsCreating(false)
    setEditingNoticia(null)
    setFormData({
      titulo: "",
      contenido: "",
      autor: "",
      categoria: "general",
      destacada: false,
      imagen_url: "",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Gestión de Noticias</h1>
          <p className="text-blue-100">Administra las noticias del municipio de Tibirita</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Botón para crear nueva noticia */}
        {!isCreating && (
          <div className="mb-6">
            <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Noticia
            </Button>
          </div>
        )}

        {/* Formulario de creación/edición */}
        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingNoticia ? "Editar Noticia" : "Crear Nueva Noticia"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contenido</label>
                  <Textarea
                    value={formData.contenido}
                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Autor</label>
                    <Input
                      value={formData.autor}
                      onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Categoría</label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="general">General</option>
                      <option value="obras">Obras</option>
                      <option value="salud">Salud</option>
                      <option value="educacion">Educación</option>
                      <option value="cultura">Cultura</option>
                      <option value="deportes">Deportes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL de Imagen (opcional)</label>
                  <Input
                    type="url"
                    value={formData.imagen_url || ""}
                    onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ingresa la URL de una imagen para mostrar en la noticia</p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="destacada"
                    checked={formData.destacada}
                    onChange={(e) => setFormData({ ...formData, destacada: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="destacada" className="text-sm font-medium">
                    Noticia destacada
                  </label>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingNoticia ? "Actualizar" : "Crear"} Noticia
                  </Button>
                  <Button type="button" onClick={resetForm} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de noticias */}
        <div className="grid gap-6">
          {noticias.map((noticia) => (
            <Card key={noticia.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{noticia.titulo}</h3>
                    {noticia.imagen_url && (
                      <div className="mb-3">
                        <img
                          src={noticia.imagen_url || "/placeholder.svg"}
                          alt={noticia.titulo}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      </div>
                    )}
                    <p className="text-gray-600 mb-3">{noticia.contenido}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Por: {noticia.autor}</span>
                      <Badge variant="secondary">{noticia.categoria}</Badge>
                      {noticia.destacada && <Badge className="bg-yellow-500">Destacada</Badge>}
                      <span>{new Date(noticia.fecha_publicacion).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      onClick={() => handleEdit(noticia)}
                      size="sm"
                      variant="outline"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(noticia.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {noticias.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">No hay noticias disponibles. Crea la primera noticia.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
