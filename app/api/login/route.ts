import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Validaciones básicas (Igual que tu PHP)
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // 2. Validar dominio
    if (!email.endsWith("@umoar.edu.sv")) {
      return NextResponse.json({ success: false, error: "El correo debe ser @umoar.edu.sv" }, { status: 400 });
    }

    // 3. Buscar usuario en DB
    // Nota: Usamos 'any' en rows para simplificar el tipado rápido de mysql2
    const [rows]: any = await pool.query("SELECT id, nombre_completo, email, password, role FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 401 });
    }

    const user = rows[0];

    // 4. Verificar contraseña (bcrypt)
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: "Contraseña incorrecta" }, { status: 401 });
    }

    // 5. Guardar sesión (Reemplaza a $_SESSION)
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.usuario = {
      id: user.id,
      nombre: user.nombre_completo,
      email: user.email,
      role: user.role || "user",
    };
    await session.save();

    // 6. Respuesta exitosa
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