"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navigationItems = [
    { name: "Inicio", href: "/" },
    { name: "Historia", href: "/historia" },
    { name: "Misión y Visión", href: "/mision-vision" },
    { name: "Noticias", href: "/noticias" },
    { name: "Trámites", href: "/tramites" },
    { name: "Sitios Turísticos", href: "/sitios-turisticos" },
    { name: "Mapa", href: "/mapa" },
    { name: "Transparencia", href: "/transparencia" },
    { name: "Testimonios", href: "/testimonios" },
  ]

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href))
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Alcaldía de Tibirita</h1>
              <p className="text-xs text-gray-600">Cundinamarca</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Hola, {user.full_name}</span>

                {/* Botón para Administradores */}
                {user.role === "administrador" && (
                  <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                    <Link href="/admin/dashboard">Panel Admin</Link>
                  </Button>
                )}

                {/* Botón para Analíticos */}
                {user.role === "analitico" && (
                  <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Link href="/dashboard/analitico">Dashboard</Link>
                  </Button>
                )}

                {/* Botón para Usuarios (también pueden ver analytics básicos) */}
                {user.role === "usuario" && (
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/dashboard/usuario">Mi Panel</Link>
                  </Button>
                )}

                <Button size="sm" variant="outline" onClick={logout}>
                  Salir
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                  <Link href="/register">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-2">
                  <p className="px-3 text-sm text-gray-600">Hola, {user.full_name}</p>

                  {user.role === "administrador" && (
                    <Button asChild size="sm" className="w-full mx-3 bg-red-600 hover:bg-red-700">
                      <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
                        Panel Admin
                      </Link>
                    </Button>
                  )}

                  {user.role === "analitico" && (
                    <Button asChild size="sm" className="w-full mx-3 bg-purple-600 hover:bg-purple-700">
                      <Link href="/dashboard/analitico" onClick={() => setIsOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                  )}

                  {user.role === "usuario" && (
                    <Button asChild size="sm" className="w-full mx-3 bg-blue-600 hover:bg-blue-700">
                      <Link href="/dashboard/usuario" onClick={() => setIsOpen(false)}>
                        Mi Panel
                      </Link>
                    </Button>
                  )}

                  <Button size="sm" variant="outline" onClick={logout} className="mx-3">
                    Salir
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button size="sm" variant="outline" className="w-full mx-3">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full mx-3 bg-green-600 hover:bg-green-700">
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
