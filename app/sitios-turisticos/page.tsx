"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Star } from "lucide-react"

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

export default function SitiosTuristicosPage() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedRating, setSelectedRating] = useState("")
  const [sitiosTuristicos, setSitiosTuristicos] = useState<SitioTuristico[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSitiosTuristicos()
  }, [])

  const fetchSitiosTuristicos = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/sitios-turisticos")
      if (response.ok) {
        const data = await response.json()
        setSitiosTuristicos(data)
      }
    } catch (error) {
      console.error("Error fetching sitios turisticos:", error)
    } finally {
      setLoading(false)
    }
  }

  const categorias = ["Naturaleza", "Patrimonio", "Arqueología", "Bienestar", "Cultura"]

  const filteredSitios = sitiosTuristicos.filter((sitio) => {
    const matchesCategory = selectedCategory === "" || sitio.categoria === selectedCategory
    const matchesRating = selectedRating === "" || sitio.calificacion >= Number.parseInt(selectedRating)
    const isActive = sitio.activo
    return matchesCategory && matchesRating && isActive
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getCategoryColor = (categoria: string) => {
    const colors = {
      Naturaleza: "bg-green-500",
      Patrimonio: "bg-blue-500",
      Arqueología: "bg-orange-500",
      Bienestar: "bg-purple-500",
      Cultura: "bg-red-500",
    }
    return colors[categoria as keyof typeof colors] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Sitios Turísticos de Tibirita</h1>
          <p className="text-xl">Descubre la belleza natural y cultural de nuestro municipio</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtrar Sitios Turísticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría</label>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Calificación mínima</label>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquier calificación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquier calificación</SelectItem>
                    <SelectItem value="5">5 estrellas</SelectItem>
                    <SelectItem value="4">4+ estrellas</SelectItem>
                    <SelectItem value="3">3+ estrellas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resultados</label>
                <div className="flex items-center h-10 px-3 bg-gray-100 rounded-md">
                  <span className="text-sm text-gray-600">{filteredSitios.length} sitios encontrados</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destacados */}
        {selectedCategory === "" && selectedRating === "" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sitios Destacados</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sitiosTuristicos
                .filter((sitio) => sitio.destacado)
                .map((sitio) => (
                  <Card key={sitio.id} className="hover:shadow-lg transition-shadow">
                    <div className="h-48 rounded-t-lg overflow-hidden">
                      <img
                        src={sitio.imagen_url || "/placeholder.svg?height=300&width=400"}
                        alt={sitio.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=300&width=400"
                        }}
                      />
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${getCategoryColor(sitio.categoria)} text-white`}>{sitio.categoria}</Badge>
                        <div className="flex">{renderStars(sitio.calificacion)}</div>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{sitio.nombre}</h3>
                      <p className="text-gray-600 text-sm">{sitio.descripcion.substring(0, 100)}...</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Sites */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Cargando sitios turísticos...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredSitios.map((sitio) => (
              <Card key={sitio.id} className="hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-64 md:h-full rounded-l-lg overflow-hidden">
                      <img
                        src={sitio.imagen_url || "/placeholder.svg?height=300&width=400"}
                        alt={sitio.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=300&width=400"
                        }}
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-2xl font-semibold text-gray-800">{sitio.nombre}</h3>
                          <Badge className={`${getCategoryColor(sitio.categoria)} text-white`}>{sitio.categoria}</Badge>
                          {sitio.destacado && <Badge className="bg-yellow-500">Destacado</Badge>}
                        </div>
                        <div className="flex items-center mb-3">
                          {renderStars(sitio.calificacion)}
                          <span className="ml-2 text-sm text-gray-600">({sitio.calificacion}/5)</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{sitio.descripcion}</p>

                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        <span>{sitio.ubicacion}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{sitio.horarios}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2 text-green-500">💰</span>
                        <span>{sitio.precio}</span>
                      </div>
                    </div>

                    <Button className="bg-green-600 hover:bg-green-700">Ver en el Mapa</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredSitios.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No se encontraron sitios turísticos con los filtros seleccionados</p>
            <Button
              onClick={() => {
                setSelectedCategory("all")
                setSelectedRating("any")
              }}
              className="mt-4"
              variant="outline"
            >
              Limpiar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
