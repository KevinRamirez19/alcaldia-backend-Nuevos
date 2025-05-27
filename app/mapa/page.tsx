"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function MapaPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [ubicacionesImportantes, setUbicacionesImportantes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUbicaciones()
  }, [])

  const fetchUbicaciones = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/ubicaciones-mapa")
      if (response.ok) {
        const data = await response.json()
        setUbicacionesImportantes(data.filter((ubicacion: any) => ubicacion.activa))
      }
    } catch (error) {
      console.error("Error fetching ubicaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (categoria: string) => {
    const colors = {
      Gobierno: "bg-blue-500",
      Salud: "bg-red-500",
      Educación: "bg-green-500",
      Recreación: "bg-purple-500",
      Religioso: "bg-yellow-500",
      Seguridad: "bg-orange-500",
      Turismo: "bg-pink-500",
    }
    return colors[categoria as keyof typeof colors] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Mapa de Tibirita</h1>
          <p className="text-xl">Conoce nuestro territorio y ubicaciones importantes</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Información General */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-green-600">📍 Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                <strong>Departamento:</strong> Cundinamarca
                <br />
                <strong>Región:</strong> Sabana Centro
                <br />
                <strong>Altitud:</strong> 2,650 msnm
                <br />
                <strong>Temperatura:</strong> 14°C promedio
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-600">📏 Extensión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                <strong>Área Total:</strong> 97 km²
                <br />
                <strong>Área Urbana:</strong> 2 km²
                <br />
                <strong>Área Rural:</strong> 95 km²
                <br />
                <strong>Población:</strong> ~3,500 habitantes
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-purple-600">🗺️ Límites</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                <strong>Norte:</strong> Tausa
                <br />
                <strong>Sur:</strong> Cogua
                <br />
                <strong>Este:</strong> Nemocón
                <br />
                <strong>Oeste:</strong> Sutatausa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mapa Integrado */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">🗺️ Mapa Interactivo de Tibirita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15906.123456789!2d-73.9167!3d5.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e40a1234567890a%3A0x1234567890abcdef!2sTibirita%2C%20Cundinamarca%2C%20Colombia!5e0!3m2!1ses!2sco!4v1234567890123!5m2!1ses!2sco"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                <strong>Coordenadas del centro:</strong> Latitud: 5.0833° N, Longitud: 73.9167° W
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a
                  href="https://maps.google.com/?q=Tibirita,Cundinamarca,Colombia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir en Google Maps
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ubicaciones Importantes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📍 Ubicaciones Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Cargando ubicaciones...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ubicacionesImportantes.map((ubicacion, index) => (
                  <div
                    key={index}
                    className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                      selectedLocation === ubicacion.nombre ? "ring-2 ring-green-500" : ""
                    }`}
                    onClick={() => setSelectedLocation(ubicacion.nombre)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">{ubicacion.nombre}</h3>
                      <Badge className={`${getCategoryColor(ubicacion.categoria)} text-white`}>
                        {ubicacion.categoria}
                      </Badge>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{ubicacion.descripcion}</p>

                    <div className="space-y-1 text-sm text-gray-500">
                      <p>
                        <strong>📍 Dirección:</strong> {ubicacion.direccion}
                      </p>
                      <p>
                        <strong>📞 Teléfono:</strong> {ubicacion.telefono}
                      </p>
                      <p>
                        <strong>🌐 Coordenadas:</strong> {ubicacion.lat}, {ubicacion.lng}
                      </p>
                    </div>

                    <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700" asChild>
                      <a
                        href={`https://maps.google.com/?q=${ubicacion.lat},${ubicacion.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver en Google Maps
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Veredas */}
        <Card>
          <CardHeader>
            <CardTitle>🏘️ Veredas del Municipio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "Centro Urbano",
                "Vereda Arrayanes",
                "Vereda Canavita",
                "Vereda Checua",
                "Vereda El Hato",
                "Vereda La Ramada",
                "Vereda Pueblo Viejo",
                "Vereda Tibacuy",
              ].map((vereda, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <span className="text-green-700 font-medium">{vereda}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
