"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export default function DashboardAnalitico() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState({
    visitasHoy: 0,
    visitasSemana: 0,
    visitasMes: 0,
    usuariosActivos: 0,
    testimoniosPendientes: 0,
    testimoniosAprobados: 0,
    totalNoticias: 0,
    totalTramites: 0,
  })

  const [chartData, setChartData] = useState({
    visitasPorDia: [],
    visitasPorPagina: [],
    testimoniosPorCalificacion: [],
    tramitesPorCategoria: [],
    usuariosPorRol: [],
    actividadPorHora: [],
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user && !["administrador", "analitico"].includes(user.role)) {
      router.push("/")
      return
    }
  }, [user, loading, router])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!["administrador", "analitico"].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>No tienes permisos para acceder a esta página</p>
      </div>
    )
  }

  const fetchAnalytics = async () => {
    try {
      // Simular datos analíticos realistas
      setStats({
        visitasHoy: 247,
        visitasSemana: 1834,
        visitasMes: 7892,
        usuariosActivos: 45,
        testimoniosPendientes: 23,
        testimoniosAprobados: 133,
        totalNoticias: 45,
        totalTramites: 89,
      })

      setChartData({
        visitasPorDia: [
          { dia: "Lun", visitas: 234, usuarios: 89 },
          { dia: "Mar", visitas: 287, usuarios: 112 },
          { dia: "Mié", visitas: 321, usuarios: 134 },
          { dia: "Jue", visitas: 298, usuarios: 98 },
          { dia: "Vie", visitas: 356, usuarios: 156 },
          { dia: "Sáb", visitas: 189, usuarios: 67 },
          { dia: "Dom", visitas: 149, usuarios: 45 },
        ],
        visitasPorPagina: [
          { pagina: "Inicio", visitas: 1234 },
          { pagina: "Trámites", visitas: 892 },
          { pagina: "Noticias", visitas: 567 },
          { pagina: "Testimonios", visitas: 445 },
          { pagina: "Historia", visitas: 334 },
          { pagina: "Turismo", visitas: 289 },
        ],
        testimoniosPorCalificacion: [
          { calificacion: "5 estrellas", cantidad: 78, color: "#10B981" },
          { calificacion: "4 estrellas", cantidad: 45, color: "#3B82F6" },
          { calificacion: "3 estrellas", cantidad: 23, color: "#F59E0B" },
          { calificacion: "2 estrellas", cantidad: 8, color: "#EF4444" },
          { calificacion: "1 estrella", cantidad: 2, color: "#6B7280" },
        ],
        tramitesPorCategoria: [
          { categoria: "Licencias", solicitudes: 34, completados: 28 },
          { categoria: "Certificados", solicitudes: 28, completados: 25 },
          { categoria: "Permisos", solicitudes: 15, completados: 12 },
          { categoria: "Otros", solicitudes: 12, completados: 10 },
        ],
        usuariosPorRol: [
          { rol: "Ciudadanos", cantidad: 1234 },
          { rol: "Administradores", cantidad: 5 },
          { rol: "Analíticos", cantidad: 3 },
        ],
        actividadPorHora: [
          { hora: "00", actividad: 12 },
          { hora: "02", actividad: 8 },
          { hora: "04", actividad: 5 },
          { hora: "06", actividad: 15 },
          { hora: "08", actividad: 45 },
          { hora: "10", actividad: 67 },
          { hora: "12", actividad: 89 },
          { hora: "14", actividad: 78 },
          { hora: "16", actividad: 92 },
          { hora: "18", actividad: 67 },
          { hora: "20", actividad: 45 },
          { hora: "22", actividad: 23 },
        ],
      })
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Analítico</h1>
            <p className="text-gray-600">Estadísticas y métricas del sitio web municipal</p>
          </div>
          <Button asChild variant="outline">
            <a href="/">← Volver al Inicio</a>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Visitas Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.visitasHoy}</div>
              <p className="text-xs text-gray-500">+12% vs ayer</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Visitas Esta Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.visitasSemana}</div>
              <p className="text-xs text-gray-500">+8% vs semana anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Visitas Este Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.visitasMes}</div>
              <p className="text-xs text-gray-500">+15% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Usuarios Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.usuariosActivos}</div>
              <p className="text-xs text-gray-500">En línea ahora</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Visitas por día */}
          <Card>
            <CardHeader>
              <CardTitle>Tráfico Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.visitasPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="visitas"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="usuarios"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Páginas más visitadas */}
          <Card>
            <CardHeader>
              <CardTitle>Páginas Más Visitadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.visitasPorPagina} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="pagina" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="visitas" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Actividad por hora */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad por Hora</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.actividadPorHora}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="actividad" stroke="#F59E0B" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Testimonios por calificación */}
          <Card>
            <CardHeader>
              <CardTitle>Satisfacción Ciudadana</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.testimoniosPorCalificacion}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ calificacion, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="cantidad"
                  >
                    {chartData.testimoniosPorCalificacion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Testimonios Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.testimoniosPendientes}</div>
              <p className="text-xs text-gray-500">Requieren moderación</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Noticias Publicadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.totalNoticias}</div>
              <p className="text-xs text-gray-500">Este año</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Trámites Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.totalTramites}</div>
              <p className="text-xs text-gray-500">Servicios activos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
