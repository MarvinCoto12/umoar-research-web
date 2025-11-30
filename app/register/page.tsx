import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegisterClient from "./RegisterClient";

export default async function RegisterPage() {
  // Obtener sesión en el servidor
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  // Verificaciones de Seguridad
  // Si no está logueado -> Login
  if (!session.usuario) {
    redirect("/login");
  }

  // Si está logueado pero NO es admin -> Home
  if (session.usuario.role !== "admin") {
    redirect("/"); 
  }

  // Renderizar el cliente (Solo si pasó las pruebas)
  return <RegisterClient />;
}