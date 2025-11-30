import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2"; 

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, nombre_completo, email, password, role FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 401 });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: "Contraseña incorrecta" }, { status: 401 });
    }

    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.usuario = {
      id: user.id,
      nombre: user.nombre_completo,
      email: user.email,
      role: user.role || "user",
    };
    await session.save();

    return NextResponse.json({
      success: true,
      nombre: user.nombre_completo,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error("Error en login API:", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
}