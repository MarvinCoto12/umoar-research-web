import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (session.usuario) {
    return NextResponse.json({
      success: true,
      usuario: session.usuario,
    });
  } else {
    return NextResponse.json({
      success: false,
      error: "No hay sesión activa",
    });
  }
}