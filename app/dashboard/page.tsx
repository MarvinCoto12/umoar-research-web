import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { Publication } from '@/types';

export default async function HomePage() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.usuario) {
    redirect("/login");
  }

  const usuario = session.usuario;
  
  // 1. Aquí ya tenemos el primer "WHERE"
  let query = `
    SELECT id, filename, title, author, created_at, uploader_id, uploader_name 
    FROM publicaciones 
    WHERE is_active = 1
  `;
  const queryParams: any[] = [];

  if (usuario.role !== 'admin') {
    // CORRECCIÓN: Usamos "AND" (no "WHERE") porque ya existe un WHERE arriba
    query += " AND uploader_id = ?"; 
    queryParams.push(usuario.id);
  }

  query += " ORDER BY created_at DESC";

  let publicaciones: Publication[] = [];

  try {
    const [rows] = await pool.query<RowDataPacket[]>(query, queryParams);
    
    publicaciones = rows.map((r) => ({
      id: r.id,
      title: r.title,
      author: r.author,
      filename: r.filename,
      createdAt: new Date(r.created_at).toISOString(),
      uploader: {
        id: r.uploader_id,
        nombre: r.uploader_name
      }
    }));
  } catch (error) {
    console.error("Error cargando panel:", error);
  }

  return <DashboardClient initialPublications={publicaciones} usuario={usuario} />;
}