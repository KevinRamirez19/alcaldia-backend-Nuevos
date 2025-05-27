"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Settings } from "lucide-react"

interface ConfiguracionSitio {
  nombre_municipio: string
  eslogan: string
  descripcion: string
  email_contacto: string
  telefono_contacto: string
  direccion_fisica: string
  horarios_atencion: string
  redes_sociales: {
    facebook: string
    twitter: string
    instagram: string
    youtube: string
  }
  configuracion_sitio: {
    mantenimiento: boolean
    registro_publico: boolean
    moderacion_testimonios: boolean
  }
}

export default function AdminConfiguracion() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState<ConfiguracionSitio>({
    nombre_municipio: "",
    eslogan: "",
    descripcion: "",
    email_contacto: "",
    telefono_contacto: "",
    direccion_fisica: "",
    horarios_atencion: "",
    redes_sociales: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
    },
    configuracion_sitio: {
      mantenimiento: false,
      registro_publico: true,
      moderacion_testimonios: true,
    },
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
      fetchConfiguracion()
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

  const fetchConfiguracion = async () => {
    try {
      // Simular datos de configuración
      setFormData({
        nombre_municipio: "Tibirita",
        eslogan: "Un municipio comprometido con el desarrollo sostenible",
        descripcion: "Alcaldía Municipal de Tibirita, Cundinamarca - Colombia",
        email_contacto: "alcaldia@tibirita.gov.co",
        telefono_contacto: "(601) 123-4567",
        direccion_fisica: "Carrera 3 # 3-45, Centro",
        horarios_atencion: "Lunes a Viernes: 8:00 AM - 5:00 PM\nSábados: 8:00 AM - 12:00 PM",
        redes_sociales: {
          facebook: "https://facebook.com/alcaldiatibrita",
          twitter: "https://twitter.com/alcaldiatibrita",
          instagram: "https://instagram.com/alcaldiatibrita",
          youtube: "https://youtube.com/alcaldiatibrita",
        },
        configuracion_sitio: {
          mantenimiento: false,
          registro_publico: true,
          moderacion_testimonios: true,
        },
      })
    } catch (error) {
      console.error("Error fetching configuracion:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Guardando configuración:", formData)
    // Aquí iría la lógica para guardar la configuración
  }

  const updateRedesSociales = (red: string, valor: string) => {
    setFormData((prev) => ({
      ...prev,
      redes_sociales: {
        ...prev.redes_sociales,
        [red]: valor,
      },
    }))
  }

  const updateConfiguracionSitio = (config: string, valor: boolean) => {
    setFormData((prev) => ({
      ...prev,
      configuracion_sitio: {
        ...prev.configuracion_sitio,
        [config]: valor,
      },
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Configuración del Sistema</h1>
            <p className="text-gray-600">Configuración general del sitio web municipal</p>
          </div>
          <Button asChild variant="outline">
            <a href="/admin/dashboard">← Volver al Panel</a>
          </Button>
        </div>

        {loadingData ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando configuración...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información General */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre_municipio">Nombre del Municipio</Label>
                    <Input
                      id="nombre_municipio"
                      value={formData.nombre_municipio}
                      onChange={(e) => setFormData({ ...formData, nombre_municipio: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eslogan">Eslogan</Label>
                    <Input
                      id="eslogan"
                      value={formData.eslogan}
                      onChange={(e) => setFormData({ ...formData, eslogan: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email_contacto">Email de Contacto</Label>
                    <Input
                      id="email_contacto"
                      type="email"
                      value={formData.email_contacto}
                      onChange={(e) => setFormData({ ...formData, email_contacto: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono_contacto">Teléfono de Contacto</Label>
                    <Input
                      id="telefono_contacto"
                      value={formData.telefono_contacto}
                      onChange={(e) => setFormData({ ...formData, telefono_contacto: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion_fisica">Dirección Física</Label>
                  <Input
                    id="direccion_fisica"
                    value={formData.direccion_fisica}
                    onChange={(e) => setFormData({ ...formData, direccion_fisica: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horarios_atencion">Horarios de Atención</Label>
                  <Textarea
                    id="horarios_atencion"
                    value={formData.horarios_atencion}
                    onChange={(e) => setFormData({ ...formData, horarios_atencion: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Redes Sociales */}
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.redes_sociales.facebook}
                      onChange={(e) => updateRedesSociales("facebook", e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.redes_sociales.twitter}
                      onChange={(e) => updateRedesSociales("twitter", e.target.value)}
                      placeholder="https://twitter.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.redes_sociales.instagram}
                      onChange={(e) => updateRedesSociales("instagram", e.target.value)}
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={formData.redes_sociales.youtube}
                      onChange={(e) => updateRedesSociales("youtube", e.target.value)}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuración del Sitio */}
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sitio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="mantenimiento"
                    checked={formData.configuracion_sitio.mantenimiento}
                    onCheckedChange={(checked) => updateConfiguracionSitio("mantenimiento", checked)}
                  />
                  <Label htmlFor="mantenimiento">Modo Mantenimiento</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="registro_publico"
                    checked={formData.configuracion_sitio.registro_publico}
                    onCheckedChange={(checked) => updateConfiguracionSitio("registro_publico", checked)}
                  />
                  <Label htmlFor="registro_publico">Permitir Registro Público</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="moderacion_testimonios"
                    checked={formData.configuracion_sitio.moderacion_testimonios}
                    onCheckedChange={(checked) => updateConfiguracionSitio("moderacion_testimonios", checked)}
                  />
                  <Label htmlFor="moderacion_testimonios">Moderación de Testimonios</Label>
                </div>
              </CardContent>
            </Card>

            {/* Botón de Guardar */}
            <div className="flex justify-end">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Guardar Configuración
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
