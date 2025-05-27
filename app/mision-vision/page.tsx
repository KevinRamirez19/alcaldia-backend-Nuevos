import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MisionVisionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Misión y Visión</h1>
          <p className="text-xl">Nuestro compromiso con Tibirita</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Misión */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-2xl text-green-600 flex items-center">🎯 Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-lg leading-relaxed">
                La Alcaldía Municipal de Tibirita tiene como misión promover el desarrollo integral y sostenible del
                municipio, garantizando la prestación eficiente de servicios públicos, fomentando la participación
                ciudadana y trabajando por el mejoramiento de la calidad de vida de todos los habitantes.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Nos comprometemos a administrar los recursos públicos con transparencia, honestidad y eficiencia,
                promoviendo el crecimiento económico, social y ambiental de nuestro territorio, respetando la diversidad
                cultural y fortaleciendo los valores democráticos.
              </p>
            </CardContent>
          </Card>

          {/* Visión */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600 flex items-center">🔮 Nuestra Visión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-lg leading-relaxed">
                Para el año 2030, Tibirita será un municipio modelo en desarrollo sostenible, reconocido por su gestión
                transparente, innovadora y participativa, donde sus habitantes disfruten de una excelente calidad de
                vida en un entorno próspero, seguro y ambientalmente responsable.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Seremos un territorio competitivo, con infraestructura moderna, servicios públicos de calidad,
                oportunidades de empleo digno y un fuerte sentido de identidad cultural y pertenencia.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Valores */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">⭐ Nuestros Valores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Transparencia</h3>
                <p className="text-gray-600 text-sm">
                  Actuamos con honestidad y claridad en todas nuestras decisiones y procesos.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Eficiencia</h3>
                <p className="text-gray-600 text-sm">
                  Optimizamos recursos y procesos para brindar el mejor servicio a la ciudadanía.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Participación</h3>
                <p className="text-gray-600 text-sm">
                  Fomentamos la participación activa de la ciudadanía en la toma de decisiones.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Sostenibilidad</h3>
                <p className="text-gray-600 text-sm">
                  Promovemos el desarrollo que satisface las necesidades presentes sin comprometer el futuro.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objetivos Estratégicos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">📋 Objetivos Estratégicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Desarrollo Social</h4>
                    <p className="text-gray-600 text-sm">
                      Mejorar la calidad de vida mediante programas de salud, educación y bienestar social.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Infraestructura</h4>
                    <p className="text-gray-600 text-sm">
                      Desarrollar y mantener infraestructura moderna que conecte y beneficie a toda la población.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Desarrollo Económico</h4>
                    <p className="text-gray-600 text-sm">
                      Fomentar el emprendimiento y la generación de empleo digno en el municipio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Medio Ambiente</h4>
                    <p className="text-gray-600 text-sm">
                      Proteger y conservar los recursos naturales para las futuras generaciones.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Gobernanza</h4>
                    <p className="text-gray-600 text-sm">
                      Fortalecer la gestión pública transparente y la participación ciudadana.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    6
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Cultura y Deporte</h4>
                    <p className="text-gray-600 text-sm">
                      Promover la identidad cultural y el deporte como pilares del desarrollo integral.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
