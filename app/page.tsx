import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navigation from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section
        className="text-white py-20 relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop&crop=center')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Bienvenidos a Tibirita</h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Un municipio comprometido con el desarrollo sostenible, la transparencia y el bienestar de nuestros
            ciudadanos
          </p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50">
            <Link href="/historia">Conoce Nuestra Historia</Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">3,500+</div>
              <div className="text-gray-600">Habitantes</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">97</div>
              <div className="text-gray-600">Km² de Territorio</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">2,650</div>
              <div className="text-gray-600">msnm de Altitud</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-orange-600 mb-2">8</div>
              <div className="text-gray-600">Veredas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Servicios y Información</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center">📋 Trámites</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Realiza tus trámites municipales de forma rápida y segura</p>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/tramites">Acceder</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center">📰 Noticias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Mantente informado de las últimas noticias del municipio</p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/noticias">Ver Noticias</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-purple-600 flex items-center">📋 Transparencia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Accede a documentos oficiales y información pública</p>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href="/transparencia">Ver Documentos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="text-orange-600 flex items-center">🏛️ Historia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Conoce la rica historia y tradiciones de nuestro municipio</p>
                <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                  <Link href="/historia">Conocer Más</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">🏞️ Sitios Turísticos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Descubre los hermosos lugares turísticos de Tibirita</p>
                <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                  <Link href="/sitios-turisticos">Explorar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="text-indigo-600 flex items-center">💬 Testimonios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Comparte tu experiencia con nuestros servicios</p>
                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/testimonios">Dejar Testimonio</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured News Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Noticias Destacadas</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <div
                className="h-48 rounded-t-lg bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop')",
                }}
              ></div>
              <CardContent className="pt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Nuevas Obras de Infraestructura</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Se inician importantes obras de mejoramiento vial en el centro del municipio...
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/noticias">Leer más</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div
                className="h-48 rounded-t-lg bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=200&fit=crop')",
                }}
              ></div>
              <CardContent className="pt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Festival Cultural 2024</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Se aproxima nuestro tradicional festival cultural con actividades para toda la familia...
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/noticias">Leer más</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div
                className="h-48 rounded-t-lg bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop')",
                }}
              ></div>
              <CardContent className="pt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Programa de Salud Comunitaria</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Nuevos programas de salud preventiva llegan a todas las veredas del municipio...
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/noticias">Leer más</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tourism Highlight */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-white p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Descubre la Belleza Natural de Tibirita</h3>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Desde la majestuosa Chorrera hasta nuestros termales naturales, Tibirita te ofrece experiencias únicas en
              contacto con la naturaleza
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50">
                <Link href="/sitios-turisticos">Explorar Sitios</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600"
              >
                <Link href="/mapa">Ver en el Mapa</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Alcaldía de Tibirita</h4>
              <p className="text-gray-300">Comprometidos con el desarrollo y bienestar de nuestro municipio</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contacto</h4>
              <p className="text-gray-300">📧 alcaldia@tibirita.gov.co</p>
              <p className="text-gray-300">📞 (601) 123-4567</p>
              <p className="text-gray-300">📍 Carrera 3 # 3-45, Centro</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Horarios</h4>
              <p className="text-gray-300">Lunes a Viernes: 8:00 AM - 5:00 PM</p>
              <p className="text-gray-300">Sábados: 8:00 AM - 12:00 PM</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Enlaces Rápidos</h4>
              <div className="space-y-2">
                <Link href="/transparencia" className="block text-gray-300 hover:text-white">
                  Transparencia
                </Link>
                <Link href="/tramites" className="block text-gray-300 hover:text-white">
                  Trámites
                </Link>
                <Link href="/noticias" className="block text-gray-300 hover:text-white">
                  Noticias
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">© 2024 Alcaldía de Tibirita. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
