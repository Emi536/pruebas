import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          Strike IQ <span className="text-green-400">Inteligencia Estratégica</span>
        </h1>
        <p className="text-xl text-gray-300">Tu plataforma de análisis y seguimiento de jugadores VIP.</p>
      </header>

      <main className="text-center">
        <p className="mb-8 text-lg">Visualiza, organiza y toma decisiones sobre la actividad de tus jugadores.</p>
        <Link href="/login">
          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-gray-900 font-semibold">
            Iniciar Sesión
          </Button>
        </Link>
      </main>

      <footer className="mt-16 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Strike IQ. Todos los derechos reservados.</p>
        <p className="mt-1">Desarrollado para la operación multicasino.</p>
      </footer>
    </div>
  )
}
