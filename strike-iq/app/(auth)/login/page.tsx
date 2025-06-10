import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default function LoginPage() {
  const signIn = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = createClient()
    const origin = headers().get("origin")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // TODO: Mejorar manejo de errores, mostrar al usuario
      console.error("Error al iniciar sesión:", error.message)
      return redirect("/login?message=Could not authenticate user")
    }

    return redirect("/dashboard/resumen") // Redirigir a una página post-login
  }

  // Placeholder para la funcionalidad de registro, si la necesitas.
  const signUp = async (formData: FormData) => {
    "use server"
    // Lógica de registro aquí
    // Por ahora, solo redirige o muestra un mensaje
    return redirect("/login?message=Sign up functionality not implemented yet")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-400">Strike IQ</CardTitle>
          <CardDescription className="text-gray-300">
            Inicia sesión para acceder a tu panel de inteligencia estratégica.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <Button
              formAction={signIn}
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-gray-900 font-semibold"
            >
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          {/* <p className="text-gray-400">
            ¿No tienes cuenta?{" "}
            <Button variant="link" formAction={signUp} className="text-green-400 hover:text-green-300 p-0 h-auto">
              Regístrate
            </Button>
          </p> */}
          <Link href="/" className="text-gray-400 hover:text-gray-200 mt-2">
            Volver al inicio
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
