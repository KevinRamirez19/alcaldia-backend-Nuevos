"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, Target, Eye, Heart } from "lucide-react"

interface Contenido {
  id: string
  tipo: "mision" | "vision" | "valores"
  contenido: string
  activo: boolean
}

export default function AdminMisionVision() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [contenidos, setContenidos] = useState<Contenido[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [editingContent, setEditingContent] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    contenido: "",
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
      fetchContenidos()
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

  const fetchContenidos = async () => {
    try {
      // Simular datos de misión, visión y valores
      setContenidos([
        {
          id: "mision",
          tipo: "mision",
          contenido:
            "La Alcaldía Municipal de Tibirita tiene como misión promover el desarrollo integral y sostenible del municipio, garantizando la prestación eficiente de servicios públicos, fomentando la participación ciudadana y trabajando por el mejoramiento de la calidad de vida de todos los habitantes.\n\nNos comprometemos a administrar los recursos públicos con transparencia, honestidad y eficiencia, promoviendo el crecimiento económico, social y ambiental de nuestro territorio, respetando la diversidad cultural y fortaleciendo los valores democráticos.",
          activo: true,
        },
        {
          id: "vision",
          tipo: "vision",
          contenido:
            "Para el año 2030, Tibirita será un municipio modelo en desarrollo sostenible, reconocido por su gestión transparente, innovadora y participativa, donde sus habitantes disfruten de una excelente calidad de vida en un entorno próspero, seguro y ambientalmente responsable.\n\nSeremos un territorio competitivo, con infraestructura moderna, servicios públicos de calidad, oportunidades de empleo digno y un fuerte sentido de identidad cultural y pertenencia.",
          activo: true,
        },
        {
          id: "valores",
          tipo: "valores",
          contenido:
            "Transparencia: Actuamos con honestidad y claridad en todas nuestras decisiones y procesos.\n\nEficiencia: Optimizamos recursos y procesos para brindar el mejor servicio a la ciudadanía.\n\nParticipación: Fomentamos la participación activa de la ciudadanía en la toma de decisiones.\n\nSostenibilidad: Promovemos el desarrollo que satisface las necesidades presentes sin comprometer el futuro.",
          activo: true,
        },
      ])
    } catch (error) {
      console.error("Error fetching contenidos:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleEdit = (contenido: Contenido) => {
    setEditingContent(contenido.id)
    setFormData({
      contenido: contenido.contenido,
      activo: contenido.activo,
    })
  }

  const handleSave = async (id: string) => {
    console.log("Guardando contenido:", id, formData)
    // Actualizar el contenido en el estado local
    setContenidos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, contenido: formData.contenido, activo: formData.activo } : c)),
    )
    setEditingContent(null)
  }

  const handleCancel = () => {
    setEditingContent(null)
    setFormData({ contenido: "", activo: true })
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "mision":
        return <Target className="w-6 h-6 text-green-600" />
      case "vision":
        return <Eye className="w-6 h-6 text-blue-600" />
      case "valores":
        return <Heart className="w-6 h-6 text-purple-600" />
      default:
        return null
    }
  }

  const getTitle = (tipo: string) => {
    switch (tipo) {
      case "mision":
        return "Nuestra Misión"
      case "vision":
        return "Nuestra Visión"
      case "valores":
        return "Nuestros Valores"
      default:
        return ""
    }
  }

  const getColor = (tipo: string) => {
    switch (tipo) {
      case "mision":
        return "border-l-green-500"
      case "vision":
        return "border-l-blue-500"
      case "valores":
        return "border-l-purple-500"
      default:
        return "border-l-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Misión, Visión y Valores</h1>
            <p className="text-gray-600">Actualiza la misión, visión y valores del municipio</p>
          </div>
          <Button asChild variant="outline">
            <a href="/admin/dashboard">← Volver al Panel</a>
          </Button>
        </div>

        {/* Lista de contenidos */}
        <div className="space-y-6">
          {loadingData ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando contenidos...</p>
            </div>
          ) : (
            contenidos.map((contenido) => (
              <Card key={contenido.id} className={`border-l-4 ${getColor(contenido.tipo)}`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {getIcon(contenido.tipo)}
                      <div>
                        <CardTitle className="text-xl">{getTitle(contenido.tipo)}</CardTitle>
                        <Badge variant={contenido.activo ? "default" : "secondary"} className="mt-1">
                          {contenido.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>
                    {editingContent !== contenido.id && (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(contenido)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editingContent === contenido.id ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contenido">Contenido</Label>
                        <Textarea
                          id="contenido"
                          value={formData.contenido}
                          onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                          rows={8}
                          className="min-h-[200px]"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="activo"
                          checked={formData.activo}
                          onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                        />
                        <Label htmlFor="activo">Contenido Activo</Label>
                      </div>

                      <div className="flex space-x-4">
                        <Button onClick={() => handleSave(contenido.id)} className="bg-green-600 hover:bg-green-700">
                          <Save className="w-4 h-4 mr-2" />
                          Guardar
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      {contenido.contenido.split("\n").map((paragraph, index) => (
                        <p key={index} className="text-gray-700 mb-3">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
