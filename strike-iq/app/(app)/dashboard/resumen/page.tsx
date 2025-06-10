import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { DollarSign, Users, TrendingUp, ListChecks } from "lucide-react"

// Tipos para los datos de las vistas
interface ResumenCasino {
  casino_name: string
  cantidad_jugadores_unicos: number | null
  ganancias_totales_casino: number | null
  apuestas_totales_casino: number | null
  apuesta_promedio_casino: number | null
}

interface ResumenBonos {
  casino_name: string
  total_bonos_ofrecidos: number | null
  total_bonos_usados: number | null
  total_monto_cargado_con_bono: number | null
  porcentaje_conversion_bonos: number | null
}

export default async function ResumenPage() {
  const supabase = createClient()

  // Obtener datos de las vistas
  const { data: resumenCasinos, error: errorResumen } = (await supabase
    .from("resumen_jugadores_por_casino")
    .select("*")) as { data: ResumenCasino[] | null; error: any }

  const { data: resumenBonos, error: errorBonos } = (await supabase.from("resumen_bonos_por_casino").select("*")) as {
    data: ResumenBonos[] | null
    error: any
  }

  if (errorResumen) console.error("Error fetching resumen casinos:", errorResumen.message)
  if (errorBonos) console.error("Error fetching resumen bonos:", errorBonos.message)

  // Calcular totales globales para las tarjetas de resumen principales
  let totalJugadores = 0
  let totalGanancias = 0
  let totalApuestas = 0
  let totalBonosUsados = 0

  if (resumenCasinos) {
    totalJugadores = resumenCasinos.reduce((acc, casino) => acc + (casino.cantidad_jugadores_unicos || 0), 0)
    totalGanancias = resumenCasinos.reduce((acc, casino) => acc + (casino.ganancias_totales_casino || 0), 0)
    totalApuestas = resumenCasinos.reduce((acc, casino) => acc + (casino.apuestas_totales_casino || 0), 0)
  }
  if (resumenBonos) {
    totalBonosUsados = resumenBonos.reduce((acc, bono) => acc + (bono.total_bonos_usados || 0), 0)
  }

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "$0"
    return `$${value.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Resumen General de Casinos</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jugadores Únicos Totales</CardTitle>
            <Users className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJugadores.toLocaleString("es-AR")}</div>
            <p className="text-xs text-muted-foreground text-gray-400">En todos los casinos</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancias Totales del Casino</CardTitle>
            <DollarSign className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalGanancias)}</div>
            <p className="text-xs text-muted-foreground text-gray-400">Suma de GGR de todos los casinos</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Apuestas Totales</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalApuestas)}</div>
            <p className="text-xs text-muted-foreground text-gray-400">Volumen total apostado</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bonos Usados Totales</CardTitle>
            <ListChecks className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBonosUsados.toLocaleString("es-AR")}</div>
            <p className="text-xs text-muted-foreground text-gray-400">Cantidad total de bonos activados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl text-green-400">Rendimiento por Casino</CardTitle>
            <CardDescription className="text-gray-300">
              Métricas clave de jugadores y financieras por cada casino.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resumenCasinos && resumenCasinos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-300 uppercase bg-gray-750">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Casino
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Jugadores
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Ganancias
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Apuestas
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Apuesta Prom.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumenCasinos.map((casino) => (
                      <tr key={casino.casino_name} className="border-b border-gray-700 hover:bg-gray-750">
                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                          {casino.casino_name}
                        </th>
                        <td className="px-6 py-4 text-right">
                          {(casino.cantidad_jugadores_unicos || 0).toLocaleString("es-AR")}
                        </td>
                        <td className="px-6 py-4 text-right">{formatCurrency(casino.ganancias_totales_casino)}</td>
                        <td className="px-6 py-4 text-right">{formatCurrency(casino.apuestas_totales_casino)}</td>
                        <td className="px-6 py-4 text-right">{formatCurrency(casino.apuesta_promedio_casino)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No hay datos de rendimiento de casinos disponibles.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl text-green-400">Resumen de Bonos por Casino</CardTitle>
            <CardDescription className="text-gray-300">Uso y conversión de bonos en cada casino.</CardDescription>
          </CardHeader>
          <CardContent>
            {resumenBonos && resumenBonos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-300 uppercase bg-gray-750">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Casino
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Ofrecidos
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Usados
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Monto Cargado (Bono)
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        % Conversión
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumenBonos.map((bono) => (
                      <tr key={bono.casino_name} className="border-b border-gray-700 hover:bg-gray-750">
                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                          {bono.casino_name}
                        </th>
                        <td className="px-6 py-4 text-right">
                          {(bono.total_bonos_ofrecidos || 0).toLocaleString("es-AR")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {(bono.total_bonos_usados || 0).toLocaleString("es-AR")}
                        </td>
                        <td className="px-6 py-4 text-right">{formatCurrency(bono.total_monto_cargado_con_bono)}</td>
                        <td className="px-6 py-4 text-right">{(bono.porcentaje_conversion_bonos || 0).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No hay datos de bonos disponibles.</p>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Aquí podrías añadir más secciones o gráficos si es necesario */}
    </div>
  )
}
