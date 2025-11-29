import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  // Leemos la sesión desde la cookie en la petición
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  const { pathname } = request.nextUrl;

  // 1. Proteger rutas privadas (Requieren login)
  if (pathname.startsWith("/home") || pathname.startsWith("/forms")) {
    if (!session.usuario) {
      // Si no hay usuario, redirigir a login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 2. Proteger rutas de Admin (Requieren rol 'admin')
  if (pathname.startsWith("/register")) {
    if (!session.usuario) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.usuario.role !== "admin") {
      // Si está logueado pero no es admin, mandarlo al home
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return response;
}

export const config = {
  // Esto es para definir en qué rutas se ejecuta el proxy
  matcher: ["/home/:path*", "/forms/:path*", "/register/:path*"],
};