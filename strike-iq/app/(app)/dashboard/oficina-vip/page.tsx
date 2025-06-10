import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, LineChart } from "lucide-react"

export default function OficinaVipPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Oficina VIP</h1>
      <p className="text-lg text-gray-300 mb-8">
        Herramientas y análisis avanzados para la gestión estratégica de jugadores VIP.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700 text-white hover:shadow-lg hover:border-green-500 transition-all">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8 text-green-400" />
              <CardTitle className="text-2xl text-green-400">Análisis Estratégico</CardTitle>
            </div>
            <CardDescription className="text-gray-300">
              Visualiza métricas clave, segmenta jugadores por valor, detecta patrones y oportunidades de
              cross-property. Esta sección replica la lógica de tu script de análisis avanzado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">
              Profundiza en el comportamiento de tus jugadores VIP para optimizar ingresos y retención.
            </p>
            <Link href="/dashboard/oficina-vip/analisis-estrategico">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-gray-900 font-semibold">
                Acceder a Análisis Estratégico
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white hover:shadow-lg hover:border-blue-500 transition-all">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <LineChart className="h-8 w-8 text-blue-400" />
              <CardTitle className="text-2xl text-blue-400">Análisis Temporal</CardTitle>
            </div>
            <CardDescription className="text-gray-300">
              Explora tendencias y realiza análisis de datos ad-hoc sin guardar registros permanentes. Ideal para
              métricas momentáneas y experimentación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">
              Utiliza esta herramienta para consultas rápidas y obtener insights sobre la marcha.
            </p>
            <Link href="/dashboard/oficina-vip/analisis-temporal">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">
                Iniciar Análisis Temporal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder para futuras secciones dentro de Oficina VIP */}
      {/* <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">Próximas Herramientas VIP</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gray-800/50 border-gray-700/50 text-white">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-6 w-6 text-yellow-400" />
                <CardTitle className="text-xl text-yellow-400">Gestión de Campañas VIP</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                (Próximamente) Planifica y ejecuta campañas de marketing personalizadas para tus segmentos VIP.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700/50 text-white">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-purple-400" />
                <CardTitle className="text-xl text-purple-400">Perfiles Detallados de Jugadores VIP</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                (Próximamente) Accede a vistas 360° de tus jugadores más valiosos.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div> */}
    </div>
  )
}
