"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Building, PlusCircle, Edit3, Trash2, Loader2, AlertCircle } from "lucide-react"

interface Casino {
  id: number
  casino_name: string
  created_at: string
}

export default function AgenciasPage() {
  const supabase = createClient()
  const [casinos, setCasinos] = useState<Casino[]>([])
  const [newCasinoName, setNewCasinoName] = useState("")
  const [editingCasino, setEditingCasino] = useState<Casino | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchCasinos = async () => {
    setIsLoading(true)
    setError(null)
    const { data, error } = await supabase.from("id_casino").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching casinos:", error)
      setError("No se pudieron cargar los casinos. " + error.message)
    } else {
      setCasinos(data as Casino[])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCasinos()
  }, [])

  const handleAddCasino = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCasinoName.trim()) {
      setFormError("El nombre del casino no puede estar vacío.")
      return
    }
    setFormError(null)
    setIsLoading(true)

    const { error } = await supabase.from("id_casino").insert([{ casino_name: newCasinoName }])

    if (error) {
      console.error("Error adding casino:", error)
      setFormError("Error al agregar el casino: " + error.message)
    } else {
      setNewCasinoName("")
      await fetchCasinos() // Refrescar lista
    }
    setIsLoading(false)
  }

  const handleEditCasino = (casino: Casino) => {
    setEditingCasino(casino)
    setNewCasinoName(casino.casino_name) // Pre-fill form for editing
  }

  const handleUpdateCasino = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCasino || !newCasinoName.trim()) {
      setFormError("El nombre del casino no puede estar vacío.")
      return
    }
    setFormError(null)
    setIsLoading(true)

    const { error } = await supabase.from("id_casino").update({ casino_name: newCasinoName }).eq("id", editingCasino.id)

    if (error) {
      console.error("Error updating casino:", error)
      setFormError("Error al actualizar el casino: " + error.message)
    } else {
      setNewCasinoName("")
      setEditingCasino(null)
      await fetchCasinos() // Refrescar lista
    }
    setIsLoading(false)
  }

  const handleDeleteCasino = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este casino? Esta acción no se puede deshacer.")) {
      return
    }
    setIsLoading(true)
    const { error } = await supabase.from("id_casino").delete().eq("id", id)
    if (error) {
      console.error("Error deleting casino:", error)
      setError("Error al eliminar el casino: " + error.message)
    } else {
      await fetchCasinos() // Refrescar lista
    }
    setIsLoading(false)
  }

  const cancelEdit = () => {
    setEditingCasino(null)
    setNewCasinoName("")
    setFormError(null)
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-100 flex items-center">
        <Building className="h-8 w-8 mr-3 text-green-400" />
        Gestión de Agencias (Casinos)
      </h1>

      <Card className="mb-8 bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl text-green-400">
            {editingCasino ? "Editar Casino" : "Agregar Nuevo Casino"}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {editingCasino
              ? `Modifica el nombre del casino "${editingCasino.casino_name}".`
              : "Añade un nuevo casino a la plataforma."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingCasino ? handleUpdateCasino : handleAddCasino} className="space-y-4">
            <div>
              <Label htmlFor="casinoName" className="text-gray-200">
                Nombre del Casino
              </Label>
              <Input
                id="casinoName"
                type="text"
                value={newCasinoName}
                onChange={(e) => setNewCasinoName(e.target.value)}
                placeholder="Ej: Casino Fénix"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            {formError && (
              <p className="text-sm text-red-400 flex items-center">
                <AlertCircle size={16} className="mr-1" /> {formError}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 text-gray-900 font-semibold"
              >
                {isLoading && !editingCasino ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : editingCasino ? (
                  <Edit3 className="mr-2 h-4 w-4" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                {editingCasino
                  ? isLoading
                    ? "Actualizando..."
                    : "Actualizar Casino"
                  : isLoading
                    ? "Agregando..."
                    : "Agregar Casino"}
              </Button>
              {editingCasino && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                  className="text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  Cancelar Edición
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl text-green-400">Lista de Casinos</CardTitle>
          <CardDescription className="text-gray-300">Casinos actualmente registrados en el sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && casinos.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-400" />
              <p className="ml-2 text-gray-300">Cargando casinos...</p>
            </div>
          ) : error && casinos.length === 0 ? (
            <div className="text-center py-8 text-red-400">
              <AlertCircle size={24} className="mx-auto mb-2" />
              {error}
            </div>
          ) : casinos.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No hay casinos registrados todavía.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-750">
                    <TableHead className="text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-300">Nombre del Casino</TableHead>
                    <TableHead className="text-gray-300">Fecha de Creación</TableHead>
                    <TableHead className="text-right text-gray-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {casinos.map((casino) => (
                    <TableRow key={casino.id} className="border-gray-700 hover:bg-gray-750">
                      <TableCell className="font-medium text-white">{casino.id}</TableCell>
                      <TableCell className="text-white">{casino.casino_name}</TableCell>
                      <TableCell className="text-white">
                        {new Date(casino.created_at).toLocaleDateString("es-AR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCasino(casino)}
                          className="text-blue-400 hover:text-blue-300 mr-2"
                          title="Editar"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCasino(casino.id)}
                          disabled={isLoading}
                          className="text-red-400 hover:text-red-300"
                          title="Eliminar"
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
