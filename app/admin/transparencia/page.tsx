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
import { Pencil, Trash2, Plus, Download } from "lucide-react"

interface DocumentoTransparencia {
  id: number
  titulo: string
  descripcion: string
  categoria: string
  archivo_url: string
  fecha_publicacion: string
  activo: boolean
}

export default function AdminTransparencia() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [documentos, setDocumentos] = useState<DocumentoTransparencia[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDoc, setEditingDoc] = useState<DocumentoTransparencia | null>(null)
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
      fetchDocumentos()
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

  const fetchDocumentos = async () => {
    try {
      // Simular datos de documentos
      setDocumentos([
        {
          id: 1,
          titulo: "Plan de Desarrollo Municipal 2024-2027",
          descripcion: "Documento que establece las metas y objetivos del municipio para el período 2024-2027",
          categoria: "Planeación",
          archivo_url: "https://ejemplo.com/plan-desarrollo.pdf",
          fecha_publicacion: "2024-01-15",
          activo: true,
        },
        {
          id: 2,
          titulo: "Presupuesto Municipal 2024",
          descripcion: "Presupuesto aprobado para la vigencia fiscal 2024",
          categoria: "Presupuesto",
          archivo_url: "https://ejemplo.com/presupuesto-2024.pdf",
          fecha_publicacion: "2024-01-01",
          activo: true,
        },
      ])
    } catch (error) {
      console.error("Error fetching documentos:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Guardando documento:", formData)
    resetForm()
    await fetchDocumentos()
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
      console.log("Eliminando documento:", id)
      await fetchDocumentos()
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Transparencia</h1>
            <p className="text-gray-600">Administra los documentos de transparencia y acceso a la información</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Documento
            </Button>
            <Button asChild variant="outline">
              <a href="/admin/dashboard">← Volver al Panel</a>
            </Button>
          </div>
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="activo"
                    checked={formData.activo}
                    onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                  />
                  <Label htmlFor="activo">Documento Activo</Label>
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

        {/* Lista de documentos */}
        <div className="grid gap-6">
          {loadingData ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando documentos...</p>
            </div>
          ) : documentos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay documentos registrados</p>
            </div>
          ) : (
            documentos.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{doc.titulo}</h3>
                        <Badge className="bg-purple-500">{doc.categoria}</Badge>
                        <Badge variant={doc.activo ? "default" : "secondary"}>
                          {doc.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{doc.descripcion}</p>
                      <div className="text-sm text-gray-500 mb-3">
                        <span>Publicado: {new Date(doc.fecha_publicacion).toLocaleDateString()}</span>
                      </div>
                      <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <a href={doc.archivo_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Ver Documento
                        </a>
                      </Button>
                    </div>
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
