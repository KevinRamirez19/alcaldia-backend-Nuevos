import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HistoriaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Historia de Tibirita</h1>
          <p className="text-xl">Descubre nuestras raíces y tradiciones</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Origen */}
        <Card className="mb-8 border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600">🏛️ Orígenes Precolombinos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              El territorio que hoy conocemos como Tibirita estuvo habitado originalmente por los pueblos indígenas
              Muiscas, quienes dejaron un legado cultural invaluable que aún perdura en nuestros días. El nombre
              "Tibirita" proviene de la lengua muisca y significa "Tierra de la Laguna Sagrada".
            </p>
            <p className="text-gray-700 leading-relaxed">
              Los Muiscas establecieron aquí importantes centros ceremoniales y desarrollaron avanzadas técnicas
              agrícolas que aprovechaban la fertilidad de nuestros suelos y la abundancia de agua de la región.
            </p>
          </CardContent>
        </Card>

        {/* Época Colonial */}
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">⛪ Época Colonial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Durante la época colonial, Tibirita se convirtió en un importante punto de paso entre Bogotá y las
              poblaciones del norte de Cundinamarca. La construcción de la iglesia de San Antonio en el siglo XVII marcó
              el establecimiento formal del poblado español.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Los colonizadores españoles introdujeron nuevas técnicas agrícolas y ganaderas, fusionándose con las
              tradiciones indígenas para crear una cultura mestiza única que caracteriza a nuestro municipio.
            </p>
          </CardContent>
        </Card>

        {/* Independencia */}
        <Card className="mb-8 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">🗽 Independencia y República</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Durante las guerras de independencia, Tibirita jugó un papel importante como punto estratégico de
              comunicaciones. Muchos de nuestros ancestros participaron activamente en la lucha por la libertad,
              contribuyendo con hombres y recursos para la causa patriota.
            </p>
            <p className="text-gray-700 leading-relaxed">
              En 1821, con la creación de la Gran Colombia, Tibirita se constituyó oficialmente como municipio,
              estableciendo las bases de la organización administrativa que conocemos hoy.
            </p>
          </CardContent>
        </Card>

        {/* Siglo XX */}
        <Card className="mb-8 border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600">🏗️ Desarrollo Moderno</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              El siglo XX trajo importantes transformaciones a Tibirita. La llegada de la carretera que conecta con
              Bogotá en los años 1950 impulsó el desarrollo económico y facilitó el intercambio comercial y cultural con
              otras regiones.
            </p>
            <p className="text-gray-700 leading-relaxed">
              La construcción de la escuela municipal, el centro de salud y otras obras de infraestructura marcaron el
              crecimiento del municipio y mejoraron significativamente la calidad de vida de sus habitantes.
            </p>
          </CardContent>
        </Card>

        {/* Tradiciones */}
        <Card className="mb-8 border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">🎭 Tradiciones y Cultura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Festividades Tradicionales</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Festival de San Antonio (Junio)</li>
                  <li>• Fiestas Patronales (Agosto)</li>
                  <li>• Festival de la Chorrera (Octubre)</li>
                  <li>• Celebraciones Navideñas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Tradiciones Gastronómicas</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Ajiaco Tibiriense</li>
                  <li>• Trucha de los ríos locales</li>
                  <li>• Quesos artesanales</li>
                  <li>• Dulces tradicionales</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Línea de Tiempo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">📅 Línea de Tiempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  Pre
                </div>
                <div>
                  <h4 className="font-semibold">Época Precolombina</h4>
                  <p className="text-gray-600">Asentamientos Muiscas en el territorio</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1600
                </div>
                <div>
                  <h4 className="font-semibold">Siglo XVII</h4>
                  <p className="text-gray-600">Construcción de la iglesia y establecimiento colonial</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  1821
                </div>
                <div>
                  <h4 className="font-semibold">Constitución Municipal</h4>
                  <p className="text-gray-600">Tibirita se constituye oficialmente como municipio</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  1950
                </div>
                <div>
                  <h4 className="font-semibold">Modernización</h4>
                  <p className="text-gray-600">Llegada de la carretera y desarrollo de infraestructura</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                  2024
                </div>
                <div>
                  <h4 className="font-semibold">Tibirita Actual</h4>
                  <p className="text-gray-600">Municipio moderno comprometido con el desarrollo sostenible</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
