import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nombre = body.nombre_completo?.trim();
    const email = body.email?.trim();
    const password = body.password;
    const roleRequest = body.role || "user";

    // Validaciones
    if (!nombre || !email || !password) {
      return NextResponse.json({ success: false, message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    if (!email.endsWith("@umoar.edu.sv")) {
      return NextResponse.json({ success: false, message: "El correo debe ser @umoar.edu.sv" }, { status: 400 });
    }

    // Seguridad de Roles
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    const currentUserRole = session.usuario?.role || "user";

    if (roleRequest === "admin" && currentUserRole !== "admin") {
      return NextResponse.json({ success: false, message: "Solo un administrador puede crear otros administradores" }, { status: 403 });
    }

    // 3. Verificar si existe el correo
    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?", 
      [email]
    );
    
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "El correo ya está registrado" }, { status: 400 });
    }

    // Hash del password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar en DB
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (nombre_completo, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())",
      [nombre, email, hashedPassword, roleRequest]
    );

    return NextResponse.json({
      success: true,
      message: "Usuario registrado correctamente",
      nombre,
      email,
      role: roleRequest
    });

  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json({ success: false, message: "Error al registrar usuario" }, { status: 500 });
  }
}