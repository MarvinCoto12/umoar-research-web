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
  
  // Ver todas las publicaciones (activas e inactivas) en el dashboard para poder gestionarlas.
  let query = `
    SELECT id, filename, title, author, created_at, uploader_id, uploader_name, is_active 
    FROM publicaciones 
    WHERE 1=1 
  `;
  const queryParams: any[] = [];

  // Si no es admin, filtramos solo las suyas (pero traemos activas y ocultas)
  if (usuario.role !== 'admin') {
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
      isActive: r.is_active === 1, 
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