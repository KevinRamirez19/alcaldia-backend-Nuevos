"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock, DollarSign, FileText } from "lucide-react"

interface Tramite {
  id: number
  nombre: string
  descripcion: string
  requisitos: string
  costo: number
  tiempo_estimado: string
  categoria: string
  documento_url?: string
  activo: boolean
}

export default function TramitesPage() {
  const [tramites, setTramites] = useState<Tramite[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const categorias = ["Licencias", "Certificados", "Permisos", "Paz y Salvos", "Otros"]

  useEffect(() => {
    fetchTramites()
  }, [])

  const fetchTramites = async () => {
    try {
      const response = await fetch("/api/tramites")
      const data = await response.json()
      if (data.success) {
        setTramites(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching tramites:", error)
      setTramites([
        {
          id: 1,
          nombre: "Certificado de Residencia",
          descripcion: "Certificado que acredita la residencia actual en el municipio de Tibirita",
          requisitos:
            "Cédula de ciudadanía original y copia\nRecibo de servicios públicos no mayor a 3 meses\nFormulario de solicitud diligenciado",
          costo: 8000,
          tiempo_estimado: "1 día hábil",
          categoria: "Certificados",
          activo: true,
        },
        {
          id: 2,
          nombre: "Licencia de Construcción Vivienda",
          descripcion: "Permiso para construcción de vivienda unifamiliar hasta 200 m²",
          requisitos:
            "Planos arquitectónicos firmados por arquitecto\nPlanos estructurales firmados por ingeniero\nEstudio de suelos\nCédula del propietario",
          costo: 250000,
          tiempo_estimado: "20 días hábiles",
          categoria: "Licencias",
          documento_url: "https://tibirita.gov.co/formularios/licencia-construccion.pdf",
          activo: true,
        },
        {
          id: 3,
          nombre: "Pago de Impuesto Predial",
          descripcion: "Liquidación y pago del impuesto predial anual",
          requisitos: "Cédula del propietario\nCertificado de libertad y tradición\nAutoavalúo catastral actualizado",
          costo: 0,
          tiempo_estimado: "Inmediato",
          categoria: "Otros",
          documento_url: "https://tibirita.gov.co/formularios/pago-predial.pdf",
          activo: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredTramites = tramites.filter((tramite) => {
    const matchesSearch =
      tramite.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tramite.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || tramite.categoria === selectedCategory
    return matchesSearch && matchesCategory && tramite.activo
  })

  const getCategoryColor = (categoria: string) => {
    const colors = {
      Licencias: "bg-blue-500",
      Certificados: "bg-green-500",
      Permisos: "bg-orange-500",
      "Paz y Salvos": "bg-purple-500",
      Otros: "bg-gray-500",
    }
    return colors[categoria as keyof typeof colors] || "bg-gray-500"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleIniciarTramite = (tramite: Tramite) => {
    const numeroRadicado = `TIB-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    alert(
      `Trámite iniciado exitosamente!\n\nNúmero de Radicado: ${numeroRadicado}\n\nTrámite: ${tramite.nombre}\n\nPróximos pasos:\n• Guarde este número de radicado\n• Prepare los documentos requeridos\n• Acérquese a la alcaldía en horarios de atención\n• Presente el número de radicado en ventanilla`,
    )
  }

  const handleMasInformacion = (tramite: Tramite) => {
    const info = `
INFORMACIÓN DETALLADA

Trámite: ${tramite.nombre}

Descripción: ${tramite.descripcion}

Requisitos:
${tramite.requisitos
  .split("\n")
  .map((req) => `• ${req}`)
  .join("\n")}

Costo: ${tramite.costo === 0 ? "Gratuito" : formatCurrency(tramite.costo)}
Tiempo estimado: ${tramite.tiempo_estimado}
Categoría: ${tramite.categoria}

INFORMACIÓN DE CONTACTO:
Dirección: Carrera 3 # 3-45, Centro
Teléfono: (601) 123-4567
Email: alcaldia@tibirita.gov.co
Horarios: Lunes a Viernes 8:00 AM - 5:00 PM

RECOMENDACIONES:
• Verifique que todos los documentos estén vigentes
• Traiga copias adicionales de los documentos
• Llegue con tiempo suficiente antes del cierre
• Para consultas, puede llamar antes de su visita
    `
    alert(info)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Trámites Municipales</h1>
          <p className="text-xl">Realiza tus trámites de forma rápida y segura</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Card className="mb-8 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-green-600">📋 Información Importante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Horarios de Atención</h4>
                <p className="text-gray-600">Lunes a Viernes: 8:00 AM - 5:00 PM</p>
                <p className="text-gray-600">Sábados: 8:00 AM - 12:00 PM</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Documentos Requeridos</h4>
                <p className="text-gray-600">• Cédula de ciudadanía</p>
                <p className="text-gray-600">• Formulario diligenciado</p>
                <p className="text-gray-600">• Documentos específicos del trámite</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Formas de Pago</h4>
                <p className="text-gray-600">• Efectivo</p>
                <p className="text-gray-600">• Transferencia bancaria</p>
                <p className="text-gray-600">• PSE</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buscar Trámites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar por nombre o descripción</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar trámites..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Filtrar por categoría</label>
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

        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando trámites...</p>
            </div>
          ) : filteredTramites.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No se encontraron trámites</p>
            </div>
          ) : (
            filteredTramites.map((tramite) => (
              <Card key={tramite.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{tramite.nombre}</h3>
                        <Badge className={`${getCategoryColor(tramite.categoria)} text-white`}>
                          {tramite.categoria}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-4">{tramite.descripcion}</p>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                          <span>
                            <strong>Costo:</strong> {tramite.costo === 0 ? "Gratuito" : formatCurrency(tramite.costo)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          <span>
                            <strong>Tiempo:</strong> {tramite.tiempo_estimado}
                          </span>
                        </div>
                        {tramite.documento_url && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="w-4 h-4 mr-2 text-purple-500" />
                            <a
                              href={tramite.documento_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Descargar Formulario
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Requisitos:</h4>
                        <div className="text-gray-700 text-sm">
                          {tramite.requisitos.split("\n").map((req, index) => (
                            <p key={index} className="mb-1">
                              • {req}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleIniciarTramite(tramite)}
                        >
                          Iniciar Trámite
                        </Button>
                        <Button variant="outline" onClick={() => handleMasInformacion(tramite)}>
                          Más Información
                        </Button>
                      </div>
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
