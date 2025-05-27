"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function UsuarioDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState({
    tramitesDisponibles: 0,
    noticiasRecientes: 0,
    testimoniosAprobados: 0,
    sitiosTuristicos: 0,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

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

  if (!user) {
    return null
  }

  const fetchStats = async () => {
    try {
      // Simular datos para el dashboard de usuario
      setStats({
        tramitesDisponibles: 15,
        noticiasRecientes: 8,
        testimoniosAprobados: 156,
        sitiosTuristicos: 12,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const chartData = [
    { name: "Trámites", value: 15 },
    { name: "Noticias", value: 8 },
    { name: "Sitios Turísticos", value: 12 },
    { name: "Testimonios", value: 25 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Mi Panel Ciudadano</h1>
          <p className="text-xl">Información y servicios municipales</p>
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
                  <p className="text-sm font-medium text-gray-600">Trámites Disponibles</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.tramitesDisponibles}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📋</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Noticias Recientes</p>
                  <p className="text-2xl font-bold text-green-600">{stats.noticiasRecientes}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">📰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Testimonios Publicados</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.testimoniosAprobados}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">💬</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sitios Turísticos</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.sitiosTuristicos}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">🏞️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Quick Access */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Servicios Municipales</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Acceso Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button asChild className="h-20 flex-col bg-blue-600 hover:bg-blue-700">
                  <Link href="/tramites">
                    <span className="text-2xl mb-2">📋</span>
                    <span>Trámites</span>
                  </Link>
                </Button>
                <Button asChild className="h-20 flex-col bg-green-600 hover:bg-green-700">
                  <Link href="/noticias">
                    <span className="text-2xl mb-2">📰</span>
                    <span>Noticias</span>
                  </Link>
                </Button>
                <Button asChild className="h-20 flex-col bg-purple-600 hover:bg-purple-700">
                  <Link href="/testimonios">
                    <span className="text-2xl mb-2">💬</span>
                    <span>Testimonios</span>
                  </Link>
                </Button>
                <Button asChild className="h-20 flex-col bg-orange-600 hover:bg-orange-700">
                  <Link href="/sitios-turisticos">
                    <span className="text-2xl mb-2">🏞️</span>
                    <span>Turismo</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">🏛️ Información Municipal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Accede a información oficial del municipio, documentos de transparencia y normatividad vigente.
              </p>
              <Button asChild className="w-full">
                <Link href="/transparencia">Ver Documentos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">🗺️ Conoce Tibirita</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Descubre la historia, cultura y atractivos turísticos de nuestro hermoso municipio.
              </p>
              <Button asChild className="w-full">
                <Link href="/historia">Explorar</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">📞 Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>📧 Email:</strong> alcaldia@tibirita.gov.co
                </p>
                <p>
                  <strong>📞 Teléfono:</strong> (601) 123-4567
                </p>
                <p>
                  <strong>📍 Dirección:</strong> Carrera 3 # 3-45, Centro
                </p>
                <p>
                  <strong>🕒 Horario:</strong> Lun-Vie 8AM-5PM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
