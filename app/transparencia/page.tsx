"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Download, Search } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface DocumentoTransparencia {
  id: number
  titulo: string
  descripcion: string
  categoria: string
  archivo_url: string
  fecha_publicacion: string
  activo: boolean
}

export default function TransparenciaPage() {
  const { user } = useAuth()
  const [documentos, setDocumentos] = useState<DocumentoTransparencia[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDoc, setEditingDoc] = useState<DocumentoTransparencia | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    archivo_url: "",
    activo: true,
  })

  const categorias = [
    "Presupuesto",
    "Contratación",
    "Planeación",
    "Informes de Gestión",
    "Normatividad",
    "Organigrama",
    "Otros",
  ]

  useEffect(() => {
    fetchDocumentos()
  }, [])

  const fetchDocumentos = async () => {
    try {
      const response = await fetch("/api/transparencia")
      const data = await response.json()
      if (data.success) {
        setDocumentos(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching documentos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingDoc ? `/api/transparencia/${editingDoc.id}` : "/api/transparencia"
      const method = editingDoc ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        await fetchDocumentos()
        resetForm()
      }
    } catch (error) {
      console.error("Error saving documento:", error)
    }
  }

  const handleEdit = (doc: DocumentoTransparencia) => {
    setEditingDoc(doc)
    setFormData({
      titulo: doc.titulo,
      descripcion: doc.descripcion,
      categoria: doc.categoria,
      archivo_url: doc.archivo_url,
      activo: doc.activo,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este documento?")) {
      try {
        const response = await fetch(`/api/transparencia/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchDocumentos()
        }
      } catch (error) {
        console.error("Error deleting documento:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      categoria: "",
      archivo_url: "",
      activo: true,
    })
    setEditingDoc(null)
    setShowForm(false)
  }

  const filteredDocumentos = documentos.filter((doc) => {
    const matchesSearch =
      doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || doc.categoria === selectedCategory
    return matchesSearch && matchesCategory && doc.activo
  })

  const isAdmin = user?.role === "administrador"

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Transparencia y Acceso a la Información</h1>
          <p className="text-xl">Documentos oficiales y información pública del municipio</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Panel de Administración</h2>
              <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Documento
              </Button>
            </div>

            {showForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{editingDoc ? "Editar Documento" : "Nuevo Documento"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="titulo">Título</Label>
                        <Input
                          id="titulo"
                          value={formData.titulo}
                          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
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

                    <div className="space-y-2">
                      <Label htmlFor="archivo_url">URL del Archivo</Label>
                      <Input
                        id="archivo_url"
                        value={formData.archivo_url}
                        onChange={(e) => setFormData({ ...formData, archivo_url: e.target.value })}
                        placeholder="https://ejemplo.com/documento.pdf"
                        required
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                        {editingDoc ? "Actualizar" : "Crear"} Documento
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buscar Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar por título o descripción</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar documentos..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Filtrar por categoría</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando documentos...</p>
            </div>
          ) : filteredDocumentos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No se encontraron documentos</p>
            </div>
          ) : (
            filteredDocumentos.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{doc.titulo}</h3>
                        <Badge className="bg-purple-500">{doc.categoria}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{doc.descripcion}</p>
                      <div className="text-sm text-gray-500 mb-4">
                        <span>Publicado: {new Date(doc.fecha_publicacion).toLocaleDateString()}</span>
                      </div>
                      <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <a href={doc.archivo_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar Documento
                        </a>
                      </Button>
                    </div>

                    {isAdmin && (
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(doc)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
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
