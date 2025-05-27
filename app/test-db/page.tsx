"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Database } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "pending"
  message: string
  data?: any
}

export default function TestDatabasePage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState({
    nombre: "Usuario de Prueba",
    email: "test@tibirita.gov.co",
    mensaje: "Este es un testimonio de prueba para verificar la conexión con la base de datos.",
  })

  const runAllTests = async () => {
    setLoading(true)
    setTestResults([])

    const tests = [
      { name: "Conexión a Supabase", test: testSupabaseConnection },
      { name: "Leer Testimonios", test: testReadTestimonios },
      { name: "Crear Testimonio", test: testCreateTestimonio },
      { name: "Leer Noticias", test: testReadNoticias },
      { name: "Leer Trámites", test: testReadTramites },
      { name: "Leer Documentos", test: testReadDocumentos },
    ]

    for (const { name, test } of tests) {
      try {
        setTestResults((prev) => [...prev, { name, status: "pending", message: "Ejecutando..." }])
        const result = await test()
        setTestResults((prev) => prev.map((r) => (r.name === name ? { ...r, ...result } : r)))
      } catch (error) {
        setTestResults((prev) =>
          prev.map((r) =>
            r.name === name
              ? {
                  ...r,
                  status: "error" as const,
                  message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
                }
              : r,
          ),
        )
      }
      // Pequeña pausa entre tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setLoading(false)
  }

  const testSupabaseConnection = async (): Promise<Partial<TestResult>> => {
    const response = await fetch("/api/test/connection")
    const data = await response.json()

    if (data.success) {
      return {
        status: "success",
        message: "Conexión exitosa a Supabase",
        data: data.info,
      }
    } else {
      return {
        status: "error",
        message: data.message || "Error de conexión",
      }
    }
  }

  const testReadTestimonios = async (): Promise<Partial<TestResult>> => {
    const response = await fetch("/api/testimonios?estado=aprobado&limit=5")
    const data = await response.json()

    if (data.success) {
      return {
        status: "success",
        message: `Se encontraron ${data.data?.length || 0} testimonios`,
        data: data.data,
      }
    } else {
      return {
        status: "error",
        message: data.message || "Error al leer testimonios",
      }
    }
  }

  const testCreateTestimonio = async (): Promise<Partial<TestResult>> => {
    const response = await fetch("/api/testimonios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...testData,
        calificacion: 5,
      }),
    })
    const data = await response.json()

    if (data.success) {
      return {
        status: "success",
        message: "Testimonio creado exitosamente",
        data: data.data,
      }
    } else {
      return {
        status: "error",
        message: data.message || "Error al crear testimonio",
      }
    }
  }

  const testReadNoticias = async (): Promise<Partial<TestResult>> => {
    const response = await fetch("/api/noticias?limit=5")
    const data = await response.json()

    if (data.success) {
      return {
        status: "success",
        message: `Se encontraron ${data.data?.length || 0} noticias`,
        data: data.data,
      }
    } else {
      return {
        status: "error",
        message: data.message || "Error al leer noticias",
      }
    }
  }

  const testReadTramites = async (): Promise<Partial<TestResult>> => {
    const response = await fetch("/api/tramites?limit=5")
    const data = await response.json()

    if (data.success) {
      return {
        status: "success",
        message: `Se encontraron ${data.data?.length || 0} trámites`,
        data: data.data,
      }
    } else {
      return {
        status: "error",
        message: data.message || "Error al leer trámites",
      }
    }
  }

  const testReadDocumentos = async (): Promise<Partial<TestResult>> => {
    const response = await fetch("/api/transparencia?limit=5")
    const data = await response.json()

    if (data.success) {
      return {
        status: "success",
        message: `Se encontraron ${data.data?.length || 0} documentos`,
        data: data.data,
      }
    } else {
      return {
        status: "error",
        message: data.message || "Error al leer documentos",
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Exitoso</Badge>
      case "error":
        return <Badge className="bg-red-500">Error</Badge>
      default:
        return <Badge className="bg-blue-500">Ejecutando</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Test de Conexión a Base de Datos</h1>
          <p className="text-gray-600">Verifica que la conexión entre el frontend y Supabase funcione correctamente</p>
        </div>

        {/* Configuración de datos de prueba */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Datos de Prueba
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={testData.nombre}
                  onChange={(e) => setTestData({ ...testData, nombre: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={testData.email}
                  onChange={(e) => setTestData({ ...testData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="mensaje">Mensaje</Label>
                <Input
                  id="mensaje"
                  value={testData.mensaje}
                  onChange={(e) => setTestData({ ...testData, mensaje: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={runAllTests} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Ejecutando Tests..." : "Ejecutar Todos los Tests"}
            </Button>
          </CardContent>
        </Card>

        {/* Resultados de los tests */}
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <h3 className="text-lg font-semibold">{result.name}</h3>
                  </div>
                  {getStatusBadge(result.status)}
                </div>

                <p className="text-gray-600 mb-3">{result.message}</p>

                {result.data && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Datos obtenidos:</h4>
                    <pre className="text-sm text-gray-600 overflow-x-auto">{JSON.stringify(result.data, null, 2)}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        {testResults.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Listo para probar</h3>
              <p className="text-gray-600">Haz clic en "Ejecutar Todos los Tests" para verificar la conexión</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
