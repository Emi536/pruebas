"use client"
import Link from "next/link"
import { Home, LineChart, UploadCloud, Building, Briefcase, PanelLeft, UserCircle, ShieldCheck } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface HeaderProps {
  userEmail?: string | null
  // userRole?: string;
}

export default function Header({ userEmail }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  // const isAdmin = userRole === 'admin';
  const isAdminUser = userEmail?.endsWith("@admin.example.com") || userEmail?.endsWith("@strikefenix.com")

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const navItems = [
    { href: "/dashboard/resumen", icon: Home, label: "Resumen General", adminOnly: false },
    { href: "/dashboard/nuevos-registros", icon: UserCircle, label: "Nuevos Registros", adminOnly: false },
    { href: "/dashboard/oficina-vip", icon: Briefcase, label: "Oficina VIP", adminOnly: false },
    {
      href: "/dashboard/oficina-vip/analisis-estrategico",
      icon: LineChart,
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
    { href: "/admin/agencias", icon: Building, label: "Agencias (Casinos)", adminOnly: true },
    { href: "/admin/carga-archivos", icon: UploadCloud, label: "Carga de Archivos", adminOnly: true },
  ]

  const filteredNavItems = navItems.filter((item) => !item.adminOnly || isAdminUser)

  // Generar breadcrumbs
  const pathSegments = pathname.split("/").filter(Boolean)
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const navItem = navItems.find((item) => item.href === href)
    const label = navItem ? navItem.label : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
    const isLast = index === pathSegments.length - 1
    return { href, label, isLast }
  })

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <ShieldCheck className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Strike IQ</span>
            </Link>
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-2.5 ${
                  pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/resumen">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbItems.map(
            (item, index) =>
              item.label.toLowerCase() !== "dashboard" && ( // No mostrar 'Dashboard' dos veces
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem key={index}>
                    {item.isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </>
              ),
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        /> */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <UserCircle className="h-6 w-6 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{userEmail || "Mi Cuenta"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem>Configuración</DropdownMenuItem>
          <DropdownMenuItem>Soporte</DropdownMenuItem>
          <DropdownMenuSeparator /> */}
          <DropdownMenuItem onClick={handleLogout}>Cerrar Sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
