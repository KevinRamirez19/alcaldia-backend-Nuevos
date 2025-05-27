"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save } from "lucide-react"

interface SeccionHistoria {
  id: string
  titulo: string
  contenido: string
  orden: number
  activa: boolean
}

export default function AdminHistoria() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [secciones, setSecciones] = useState<SeccionHistoria[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    activa: true,
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
      fetchSecciones()
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

  const fetchSecciones = async () => {
    try {
      // Simular datos de secciones de historia
      setSecciones([
        {
          id: "origenes",
          titulo: "Orígenes Precolombinos",
          contenido:
            'El territorio que hoy conocemos como Tibirita estuvo habitado originalmente por los pueblos indígenas Muiscas, quienes dejaron un legado cultural invaluable que aún perdura en nuestros días. El nombre "Tibirita" proviene de la lengua muisca y significa "Tierra de la Laguna Sagrada".\n\nLos Muiscas establecieron aquí importantes centros ceremoniales y desarrollaron avanzadas técnicas agrícolas que aprovechaban la fertilidad de nuestros suelos y la abundancia de agua de la región.',
          orden: 1,
          activa: true,
        },
        {
          id: "colonial",
          titulo: "Época Colonial",
          contenido:
            "Durante la época colonial, Tibirita se convirtió en un importante punto de paso entre Bogotá y las poblaciones del norte de Cundinamarca. La construcción de la iglesia de San Antonio en el siglo XVII marcó el establecimiento formal del poblado español.\n\nLos colonizadores españoles introdujeron nuevas técnicas agrícolas y ganaderas, fusionándose con las tradiciones indígenas para crear una cultura mestiza única que caracteriza a nuestro municipio.",
          orden: 2,
          activa: true,
        },
        {
          id: "independencia",
          titulo: "Independencia y República",
          contenido:
            "Durante las guerras de independencia, Tibirita jugó un papel importante como punto estratégico de comunicaciones. Muchos de nuestros ancestros participaron activamente en la lucha por la libertad, contribuyendo con hombres y recursos para la causa patriota.\n\nEn 1821, con la creación de la Gran Colombia, Tibirita se constituyó oficialmente como municipio, estableciendo las bases de la organización administrativa que conocemos hoy.",
          orden: 3,
          activa: true,
        },
        {
          id: "moderno",
          titulo: "Desarrollo Moderno",
          contenido:
            "El siglo XX trajo importantes transformaciones a Tibirita. La llegada de la carretera que conecta con Bogotá en los años 1950 impulsó el desarrollo económico y facilitó el intercambio comercial y cultural con otras regiones.\n\nLa construcción de la escuela municipal, el centro de salud y otras obras de infraestructura marcaron el crecimiento del municipio y mejoraron significativamente la calidad de vida de sus habitantes.",
          orden: 4,
          activa: true,
        },
      ])
    } catch (error) {
      console.error("Error fetching secciones:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleEdit = (seccion: SeccionHistoria) => {
    setEditingSection(seccion.id)
    setFormData({
      titulo: seccion.titulo,
      contenido: seccion.contenido,
      activa: seccion.activa,
    })
  }

  const handleSave = async (id: string) => {
    console.log("Guardando sección:", id, formData)
    // Actualizar la sección en el estado local
    setSecciones((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, titulo: formData.titulo, contenido: formData.contenido, activa: formData.activa } : s,
      ),
    )
    setEditingSection(null)
  }

  const handleCancel = () => {
    setEditingSection(null)
    setFormData({ titulo: "", contenido: "", activa: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Historia Municipal</h1>
            <p className="text-gray-600">Edita el contenido histórico del municipio</p>
          </div>
          <Button asChild variant="outline">
            <a href="/admin/dashboard">← Volver al Panel</a>
          </Button>
        </div>

        {/* Lista de secciones */}
        <div className="space-y-6">
          {loadingData ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando secciones...</p>
            </div>
          ) : (
            secciones.map((seccion) => (
              <Card key={seccion.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-xl">{seccion.titulo}</CardTitle>
                      <Badge variant={seccion.activa ? "default" : "secondary"}>
                        {seccion.activa ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                    {editingSection !== seccion.id && (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(seccion)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editingSection === seccion.id ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="titulo">Título</Label>
                        <Input
                          id="titulo"
                          value={formData.titulo}
                          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        />
                      </div>

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
                          id="activa"
                          checked={formData.activa}
                          onCheckedChange={(checked) => setFormData({ ...formData, activa: checked })}
                        />
                        <Label htmlFor="activa">Sección Activa</Label>
                      </div>

                      <div className="flex space-x-4">
                        <Button onClick={() => handleSave(seccion.id)} className="bg-green-600 hover:bg-green-700">
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
                      {seccion.contenido.split("\n").map((paragraph, index) => (
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
