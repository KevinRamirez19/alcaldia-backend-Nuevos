"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Newspaper, MapPin, MessageSquare, Building, History, Target, Map, Settings } from "lucide-react"

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user && user.role !== "administrador") {
      router.push("/dashboard/usuario")
      return
    }
  }, [user, loading, router])

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

  if (!user || user.role !== "administrador") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página</p>
          <button
            onClick={() => router.push("/dashboard/usuario")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ir al Dashboard de Usuario
          </button>
        </div>
      </div>
    )
  }

  const adminModules = [
    {
      title: "Gestión de Noticias",
      description: "Crear, editar y eliminar noticias del municipio",
      icon: Newspaper,
      href: "/admin/noticias",
      color: "bg-blue-500",
    },
    {
      title: "Gestión de Trámites",
      description: "Administrar trámites y servicios municipales",
      icon: FileText,
      href: "/admin/tramites",
      color: "bg-green-500",
    },
    {
      title: "Gestión de Testimonios",
      description: "Moderar y aprobar testimonios ciudadanos",
      icon: MessageSquare,
      href: "/admin/testimonios",
      color: "bg-purple-500",
    },
    {
      title: "Transparencia",
      description: "Gestionar documentos de transparencia",
      icon: Building,
      href: "/admin/transparencia",
      color: "bg-orange-500",
    },
    {
      title: "Sitios Turísticos",
      description: "Administrar lugares turísticos del municipio",
      icon: MapPin,
      href: "/admin/sitios-turisticos",
      color: "bg-pink-500",
    },
    {
      title: "Historia Municipal",
      description: "Editar contenido histórico del municipio",
      icon: History,
      href: "/admin/historia",
      color: "bg-indigo-500",
    },
    {
      title: "Misión y Visión",
      description: "Actualizar misión, visión y valores",
      icon: Target,
      href: "/admin/mision-vision",
      color: "bg-red-500",
    },
    {
      title: "Gestión del Mapa",
      description: "Administrar ubicaciones y puntos de interés",
      icon: Map,
      href: "/admin/mapa",
      color: "bg-teal-500",
    },
    {
      title: "Configuración",
      description: "Configuración general del sistema",
      icon: Settings,
      href: "/admin/configuracion",
      color: "bg-gray-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Panel de Administración</h1>
          <p className="text-xl">Gestiona todo el contenido del sitio web municipal</p>
          <p className="text-lg mt-2">Bienvenido, {user.full_name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-bold text-blue-600">1,234</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Testimonios Pendientes</p>
                  <p className="text-2xl font-bold text-green-600">23</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">💬</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Noticias Activas</p>
                  <p className="text-2xl font-bold text-purple-600">45</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">📰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Trámites Disponibles</p>
                  <p className="text-2xl font-bold text-orange-600">89</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">📋</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{module.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                    <Button asChild className="w-full">
                      <Link href={module.href}>Gestionar</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/noticias">Nueva Noticia</Link>
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/admin/tramites">Nuevo Trámite</Link>
              </Button>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/admin/testimonios">Ver Testimonios</Link>
              </Button>
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link href="/dashboard/analitico">Ver Analytics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
