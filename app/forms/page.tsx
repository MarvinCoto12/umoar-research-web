import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FormClient from "./FormClient";

export default async function UploadPage() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  // Si no hay usuario, redirigir inmediatamente desde el servidor
  if (!session.usuario) {
    redirect("/login");
  }

  return <FormClient user={session.usuario} />;
}