"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, User } from "lucide-react"

interface Noticia {
  id: number
  titulo: string
  contenido: string
  autor: string
  categoria: string
  imagen_url?: string
  destacada: boolean
  fecha_publicacion: string
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const categorias = ["general", "obras", "salud", "educacion", "cultura", "deportes"]

  useEffect(() => {
    fetchNoticias()
  }, [])

  const fetchNoticias = async () => {
    try {
      const response = await fetch("/api/noticias")
      const data = await response.json()
      if (data.success) {
        setNoticias(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching noticias:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNoticias = noticias.filter((noticia) => {
    const matchesSearch =
      noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.contenido.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || noticia.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const noticiasDestacadas = noticias.filter((noticia) => noticia.destacada).slice(0, 3)
  const noticiasRegulares = filteredNoticias.filter((noticia) => !noticia.destacada)

  const getCategoryColor = (categoria: string) => {
    const colors = {
      general: "bg-blue-500",
      obras: "bg-orange-500",
      salud: "bg-red-500",
      educacion: "bg-green-500",
      cultura: "bg-purple-500",
      deportes: "bg-yellow-500",
    }
    return colors[categoria as keyof typeof colors] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div
        className="text-white py-16 relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=400&fit=crop&crop=center')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl font-bold mb-4">Noticias de Tibirita</h1>
          <p className="text-xl">Mantente informado de las últimas noticias del municipio</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Noticias Destacadas */}
        {noticiasDestacadas.length > 0 && searchTerm === "" && selectedCategory === "" && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Noticias Destacadas</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {noticiasDestacadas.map((noticia) => (
                <Card key={noticia.id} className="hover:shadow-lg transition-shadow">
                  <div
                    className="h-48 rounded-t-lg bg-cover bg-center"
                    style={{
                      backgroundImage: noticia.imagen_url
                        ? `url('${noticia.imagen_url}')`
                        : "url('https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=200&fit=crop')",
                    }}
                  ></div>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={`${getCategoryColor(noticia.categoria)} text-white`}>{noticia.categoria}</Badge>
                      <Badge className="bg-yellow-500">Destacada</Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{noticia.titulo}</h3>
                    <p className="text-gray-600 mb-4">{noticia.contenido.substring(0, 150)}...</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{noticia.autor}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(noticia.fecha_publicacion).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buscar Noticias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar por título o contenido</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar noticias..."
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
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Todas las Noticias */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {searchTerm || selectedCategory ? "Resultados de Búsqueda" : "Todas las Noticias"}
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando noticias...</p>
            </div>
          ) : filteredNoticias.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No se encontraron noticias</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredNoticias.map((noticia) => (
                <Card key={noticia.id} className="hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/4">
                      <div
                        className="h-48 md:h-full rounded-l-lg bg-cover bg-center"
                        style={{
                          backgroundImage: noticia.imagen_url
                            ? `url('${noticia.imagen_url}')`
                            : "url('https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=200&fit=crop')",
                        }}
                      ></div>
                    </div>
                    <div className="md:w-3/4 p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={`${getCategoryColor(noticia.categoria)} text-white`}>
                          {noticia.categoria}
                        </Badge>
                        {noticia.destacada && <Badge className="bg-yellow-500">Destacada</Badge>}
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-3">{noticia.titulo}</h3>
                      <p className="text-gray-700 mb-4">{noticia.contenido}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{noticia.autor}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(noticia.fecha_publicacion).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
