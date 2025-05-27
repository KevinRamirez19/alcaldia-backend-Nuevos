import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Para simplificar, permitir acceso a todas las rutas por ahora
  // El control de roles se maneja en el frontend
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
