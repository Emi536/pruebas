"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadCloud, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
// Para parsear CSV, podrías usar 'papaparse'. Necesitarías instalarlo: npm install papaparse
// import Papa from "papaparse";

// Tipos para las tablas (simplificado)
interface Casino {
  id: number
  casino_name: string
}

const TABLAS_DISPONIBLES = [
  { value: "historial_jugadores", label: "Historial de Jugadores" },
  { value: "bonos_strikeiq", label: "Bonos StrikeIQ" },
  { value: "transacciones_jugadores", label: "Transacciones de Jugadores" },
  { value: "catalogo_juegos", label: "Catálogo de Juegos" },
  { value: "princis_jugadores", label: "Princis Jugadores" },
  { value: "jugadores_nuevos", label: "Jugadores Nuevos" },
]

export default function CargaArchivosPage() {
  const supabase = createClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [selectedCasino, setSelectedCasino] = useState<string>("") // ID del casino
  const [casinos, setCasinos] = useState<Casino[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null)

  // Cargar casinos para el selector
  useState(() => {
    const fetchCasinos = async () => {
      const { data, error } = await supabase.from("id_casino").select("id, casino_name")
      if (data) setCasinos(data as Casino[])
      if (error) console.error("Error fetching casinos for upload:", error)
    }
    fetchCasinos()
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
      setFeedback(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedFile || !selectedTable) {
      setFeedback({ type: "error", message: "Por favor, selecciona un archivo y una tabla de destino." })
      return
    }
    // Para tablas que requieren id_casino, asegurarse que esté seleccionado
    const requiresCasinoId = [
      "historial_jugadores",
      "bonos_strikeiq",
      "transacciones_jugadores",
      "princis_jugadores",
      "jugadores_nuevos",
    ].includes(selectedTable)
    if (requiresCasinoId && !selectedCasino) {
      setFeedback({
        type: "error",
        message: `La tabla '${TABLAS_DISPONIBLES.find((t) => t.value === selectedTable)?.label}' requiere que selecciones un casino.`,
      })
      return
    }

    setIsLoading(true)
    setFeedback(null)

    // Aquí iría la lógica para leer el archivo (ej. CSV con PapaParse)
    // y luego insertar los datos en la tabla de Supabase seleccionada.
    // Esto es complejo y depende del formato de tus archivos.
    // Por ahora, es una simulación.

    // Ejemplo de cómo podrías leer un CSV (necesita PapaParse)
    /*
    if (selectedFile.type === "text/csv") {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const dataToInsert = results.data.map(row => {
            // Aquí transformarías las columnas del CSV a las de tu tabla Supabase
            // y añadirías id_casino si es necesario
            const transformedRow = { ...row }; // Placeholder
            if (requiresCasinoId && selectedCasino) {
              transformedRow.id_casino = parseInt(selectedCasino);
            }
            // Convertir tipos de datos si es necesario (ej. strings a numbers/dates)
            return transformedRow;
          });

          if (dataToInsert.length > 0) {
            const { error: insertError } = await supabase.from(selectedTable).insert(dataToInsert);
            if (insertError) {
              setFeedback({type: "error", message: `Error al insertar datos: ${insertError.message}`});
            } else {
              setFeedback({type: "success", message: `¡${dataToInsert.length} registros cargados exitosamente en ${selectedTable}!`});
              setSelectedFile(null); // Resetear input de archivo
            }
          } else {
            setFeedback({type: "error", message: "El archivo CSV está vacío o no tiene datos válidos."});
          }
          setIsLoading(false);
        },
        error: (error) => {
          setFeedback({type: "error", message: `Error al parsear CSV: ${error.message}`});
          setIsLoading(false);
        }
      });
    } else {
      setFeedback({type: "error", message: "Formato de archivo no soportado. Por favor, usa CSV."});
      setIsLoading(false);
    }
    */

    // Simulación actual:
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simular carga
    if (selectedFile.name.includes("error")) {
      setFeedback({ type: "error", message: "Error simulado durante la carga del archivo." })
    } else {
      setFeedback({
        type: "success",
        message: `Archivo "${selectedFile.name}" procesado para la tabla "${selectedTable}". (Simulación)`,
      })
    }
    setIsLoading(false)
  }

  const requiresCasinoSelection = [
    "historial_jugadores",
    "bonos_strikeiq",
    "transacciones_jugadores",
    "princis_jugadores",
    "jugadores_nuevos",
  ].includes(selectedTable)

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-100 flex items-center">
        <UploadCloud className="h-8 w-8 mr-3 text-green-400" />
        Carga Masiva de Archivos
      </h1>

      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl text-green-400">Subir Datos</CardTitle>
          <CardDescription className="text-gray-300">
            Selecciona un archivo (CSV recomendado) y la tabla de destino para cargar los datos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="tableSelect" className="text-gray-200">
                Tabla de Destino
              </Label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger
                  id="tableSelect"
                  className="bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500"
                >
                  <SelectValue placeholder="Selecciona una tabla" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {TABLAS_DISPONIBLES.map((table) => (
                    <SelectItem key={table.value} value={table.value} className="hover:bg-gray-600">
                      {table.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {requiresCasinoSelection && (
              <div>
                <Label htmlFor="casinoSelect" className="text-gray-200">
                  Casino (si aplica)
                </Label>
                <Select value={selectedCasino} onValueChange={setSelectedCasino}>
                  <SelectTrigger
                    id="casinoSelect"
                    className="bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500"
                  >
                    <SelectValue placeholder="Selecciona un casino" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    {casinos.map((casino) => (
                      <SelectItem key={casino.id} value={String(casino.id)} className="hover:bg-gray-600">
                        {casino.casino_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="fileUpload" className="text-gray-200">
                Archivo a Cargar
              </Label>
              <Input
                id="fileUpload"
                type="file"
                onChange={handleFileChange}
                accept=".csv" // Limitar a CSV por ahora, puedes expandir
                className="bg-gray-700 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-gray-900 hover:file:bg-green-700"
              />
              {selectedFile && (
                <p className="text-sm text-gray-400 mt-2 flex items-center">
                  <FileText size={16} className="mr-1 text-green-400" /> Archivo seleccionado: {selectedFile.name}
                </p>
              )}
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-md text-sm flex items-center ${
                  feedback.type === "error" ? "bg-red-900/50 text-red-300" : "bg-green-900/50 text-green-300"
                }`}
              >
                {feedback.type === "error" ? (
                  <AlertCircle size={18} className="mr-2" />
                ) : (
                  <CheckCircle2 size={18} className="mr-2" />
                )}
                {feedback.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !selectedFile || !selectedTable}
              className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-gray-900 font-semibold"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
              {isLoading ? "Cargando..." : "Cargar Archivo"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8 bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-400">Instrucciones y Consideraciones</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-300 space-y-2">
          <p>
            1. Asegúrate de que el archivo CSV tenga una fila de encabezado (header) con nombres de columna que
            coincidan (o puedan mapearse) con la tabla de destino.
          </p>
          <p>
            2. Para tablas que tienen una columna `id_casino` (como Historial de Jugadores, Bonos, etc.), selecciona el
            casino correspondiente si la información del archivo pertenece a uno específico.
          </p>
          <p>
            3. El sistema intentará mapear las columnas del CSV a las columnas de la tabla. Un mapeo más robusto y
            transformación de datos se implementará progresivamente.
          </p>
          <p>
            4. Por ahora, la carga de archivos grandes puede tomar tiempo. Se recomienda probar con archivos pequeños
            inicialmente.
          </p>
          <p>
            5. <strong className="text-yellow-300">Importante:</strong> La validación de datos y el manejo de errores
            duplicados o de formato son cruciales y se irán mejorando.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
