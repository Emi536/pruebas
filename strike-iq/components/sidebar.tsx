"use client"

import Link from "next/link"
import {
  Home,
  LineChart,
  UploadCloud,
  Building,
  Briefcase,
  LogOut,
  BarChart3,
  ShieldCheck,
  UserPlus,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SidebarProps {
  userEmail?: string | null
  // userRole?: string; // Podrías pasar el rol para mostrar/ocultar items
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  // const isAdmin = userRole === 'admin'; // Ejemplo de comprobación de rol

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh() // Asegura que el estado del servidor se actualice
  }

  const navItems = [
    // Sección General / Dashboard Principal
    { href: "/dashboard/resumen", icon: Home, label: "Resumen General", adminOnly: false },
    { href: "/dashboard/nuevos-registros", icon: UserPlus, label: "Nuevos Registros", adminOnly: false },

    // Oficina VIP
    { href: "/dashboard/oficina-vip", icon: Briefcase, label: "Oficina VIP", adminOnly: false },
    {
      href: "/dashboard/oficina-vip/analisis-estrategico",
      icon: BarChart3,
      label: "Análisis Estratégico",
      adminOnly: false,
      parent: "/dashboard/oficina-vip",
    },
    {
      href: "/dashboard/oficina-vip/analisis-temporal",
      icon: LineChart,
      label: "Análisis Temporal",
      adminOnly: false,
      parent: "/dashboard/oficina-vip",
    },

    // Sección Admin (condicionalmente visible)
    // if (isAdmin) { ... }
    { href: "/admin/agencias", icon: Building, label: "Agencias (Casinos)", adminOnly: true },
    { href: "/admin/carga-archivos", icon: UploadCloud, label: "Carga de Archivos", adminOnly: true },
    // { href: "/admin/gestion-usuarios", icon: Users, label: "Gestión de Usuarios", adminOnly: true },
  ]

  // Filtrar items basados en rol (ejemplo simple basado en email de admin)
  // Una solución más robusta usaría roles de Supabase (user_metadata)
  const isAdminUser = userEmail?.endsWith("@admin.example.com") || userEmail?.endsWith("@strikefenix.com")

  const filteredNavItems = navItems.filter((item) => !item.adminOnly || isAdminUser)

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <ShieldCheck className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Strike IQ</span>
          </Link>

          {filteredNavItems
            .filter((item) => !item.parent)
            .map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    } transition-colors hover:text-foreground md:h-8 md:w-8`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === "/settings"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Configuración</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Configuración</TooltipContent>
          </Tooltip> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Cerrar Sesión</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Cerrar Sesión</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  )
}
