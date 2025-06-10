"use client" // Esta página probablemente necesitará interactividad del cliente

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, PlayCircle, Loader2, ServerCrash } from "lucide-react"

// Esta es una página placeholder para la funcionalidad de análisis temporal.
// La idea es que el usuario pueda, por ejemplo, pegar datos CSV o escribir consultas
// para un análisis rápido sin afectar la base de datos principal.
// La ejecución de consultas SQL directamente desde el frontend es un RIESGO DE SEGURIDAD.
// Esto debería hacerse a través de una API segura o Server Actions que validen
// y limiten las consultas permitidas, o interactúen con un entorno de datos aislado.

export default function AnalisisTemporalPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRunQuery = async () => {
    if (!query.trim()) {
      setError("Por favor, ingresa datos o una consulta para analizar.")
      return
    }
    setIsLoading(true)
    setError(null)
    setResults(null)

    // SIMULACIÓN DE EJECUCIÓN DE CONSULTA
    // En un caso real, esto llamaría a un Server Action o API endpoint.
    // NO EJECUTAR SQL DIRECTAMENTE DESDE EL CLIENTE EN PRODUCCIÓN.
    try {
      // Ejemplo: Si el usuario pega un CSV, podrías parsearlo aquí.
      // Si es una "consulta" predefinida, el backend la ejecutaría.
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simular delay de red/procesamiento

      // Simulación de resultados
      if (query.toLowerCase().includes("error")) {
        throw new Error("Error simulado en el análisis.")
      } else if (query.toLowerCase().includes("jugadores activos")) {
        setResults({
          description: "Resultado del análisis de jugadores activos (simulado):",
          data: [
            { mes: "Enero", activos: 120, nuevos: 30 },
            { mes: "Febrero", activos: 150, nuevos: 40 },
            { mes: "Marzo", activos: 135, nuevos: 25 },
          ],
          type: "table",
        })
      } else {
        setResults({
          description: "Resultado del análisis genérico (simulado):",
          data: `Se procesó la entrada: "${query.substring(0, 100)}${query.length > 100 ? "..." : ""}". Datos de ejemplo: ${Math.floor(Math.random() * 1000)} registros analizados.`,
          type: "text",
        })
      }
    } catch (e: any) {
      setError(e.message || "Ocurrió un error durante el análisis.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-100">Análisis Temporal de Datos</h1>
      <p className="text-gray-400 mb-6">
        Realiza análisis rápidos y explora métricas momentáneas sin guardar registros.
      </p>

      <Alert variant="default" className="mb-6 bg-blue-900/30 border-blue-500 text-blue-300">
        <Lightbulb className="h-5 w-5 text-blue-400" />
        <AlertTitle className="font-semibold text-blue-200">¿Cómo funciona?</AlertTitle>
        <AlertDescription>
          Pega aquí un conjunto de datos (ej. CSV) o describe el tipo de análisis que deseas realizar sobre datos
          temporales. Esta herramienta es para exploración y no modifica tu base de datos principal.
          <strong className="block mt-1">
            Importante: La ejecución de consultas complejas o sobre grandes volúmenes de datos se realizará de forma
            segura en el backend.
          </strong>
        </AlertDescription>
      </Alert>

      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl text-green-400">Zona de Análisis</CardTitle>
          <CardDescription className="text-gray-300">Ingresa tus datos o consulta descriptiva.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ej: 'Mostrar jugadores activos por mes del último trimestre (datos de ejemplo)' o pega aquí datos en formato CSV..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={8}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500 mb-4"
          />
          <Button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-gray-900 font-semibold"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
            {isLoading ? "Procesando..." : "Ejecutar Análisis"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-6 bg-red-900/30 border-red-500 text-red-300">
          <ServerCrash className="h-5 w-5 text-red-400" />
          <AlertTitle className="font-semibold text-red-200">Error en el Análisis</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && !error && (
        <Card className="mt-6 bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl text-green-400">Resultados del Análisis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-3">{results.description}</p>
            {results.type === "table" && Array.isArray(results.data) ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-300 uppercase bg-gray-750">
                    <tr>
                      {Object.keys(results.data[0] || {}).map((key) => (
                        <th scope="col" className="px-6 py-3" key={key}>
                          {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.data.map((row: any, index: number) => (
                      <tr key={index} className="border-b border-gray-700 hover:bg-gray-750">
                        {Object.values(row).map((val: any, i: number) => (
                          <td className="px-6 py-4" key={i}>
                            {typeof val === "number" ? val.toLocaleString("es-AR") : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <pre className="bg-gray-900 p-4 rounded-md text-sm overflow-x-auto">
                {typeof results.data === "object" ? JSON.stringify(results.data, null, 2) : results.data}
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
