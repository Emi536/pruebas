import type React from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  // Aquí podrías obtener el rol del usuario si lo guardas en user_metadata
  // const { data: userDetails, error: userError } = await supabase
  //   .from('users') // o tu tabla de perfiles
  //   .select('role')
  //   .eq('id', user.id)
  //   .single();
  // const userRole = userDetails?.role || 'viewer'; // Rol por defecto

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar userEmail={user.email} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header userEmail={user.email} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">{children}</main>
      </div>
    </div>
  )
}
