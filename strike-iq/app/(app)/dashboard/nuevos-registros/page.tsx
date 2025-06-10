import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { UserPlus, CalendarDays, MessageSquareText, Tag, Phone } from "lucide-react"

interface NuevoJugador {
  nombre: string | null
  telefono: string | null
  fecha_ultimo_mensaje: string | null // Mantener como string para formatear
  fecha_creacion: string | null // Mantener como string para formatear
  casino_name: string | null
  notas: string | null
  etiquetas: string | null
  sesiones: string | null
}

export default async function NuevosRegistrosPage() {
  const supabase = createClient()

  const { data: nuevosJugadores, error } = (await supabase
    .from("actividad_reciente_nuevos_jugadores") // Usando la vista creada
    .select("*")
    .limit(50)) as { data: NuevoJugador[] | null; error: any } // Limitar para no sobrecargar

  if (error) {
    console.error("Error fetching nuevos jugadores:", error.message)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return "Fecha inválida"
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Nuevos Registros de Jugadores</h1>
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl text-green-400">Actividad Reciente</CardTitle>
          <CardDescription className="text-gray-300">
            Lista de los últimos jugadores registrados y su actividad inicial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {nuevosJugadores && nuevosJugadores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-300 uppercase bg-gray-750">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Casino
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Teléfono
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Últ. Mensaje
                    </th>
                    <th scope="col" className="px-6 py-3">
                      F. Creación
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Etiquetas
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Notas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {nuevosJugadores.map((jugador, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="px-6 py-4 font-medium whitespace-nowrap text-white flex items-center">
                        <UserPlus className="h-4 w-4 mr-2 text-green-400" />
                        {jugador.nombre || "N/A"}
                      </td>
                      <td className="px-6 py-4">{jugador.casino_name || "N/A"}</td>
                      <td className="px-6 py-4">
                        {jugador.telefono ? (
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" /> {jugador.telefono}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center">
                          <MessageSquareText className="h-3 w-3 mr-1 text-gray-400" />{" "}
                          {formatDate(jugador.fecha_ultimo_mensaje)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1 text-gray-400" /> {formatDate(jugador.fecha_creacion)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {jugador.etiquetas ? (
                          <span className="flex items-center">
                            <Tag className="h-3 w-3 mr-1 text-gray-400" /> {jugador.etiquetas}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs" title={jugador.notas || undefined}>
                        {jugador.notas || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400 text-lg">No hay nuevos registros de jugadores por el momento.</p>
              <p className="text-gray-500 text-sm">Los nuevos jugadores aparecerán aquí cuando se registren.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
