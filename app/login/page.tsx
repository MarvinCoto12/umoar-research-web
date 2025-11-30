import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  // Si ya está logueado, lo mandamos a /home directo.
  // Esto evita que vea el formulario de login innecesariamente.
  if (session.usuario) {
    redirect("/dashboard");
  }

  return <LoginClient />;
}