import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/session';
import HomeClient from './HomeClient'; 
import { Publication } from '@/types'; 

export default async function PublicHome() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const user = session.usuario || null;

  let publications: Publication[] = [];
  
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, filename, original_name AS originalName, title, author, career, type, description, uploader_id AS uploaderId, uploader_name AS uploaderName, created_at AS createdAt
        FROM publicaciones
        WHERE is_active = 1
        ORDER BY created_at DESC`
    );

    publications = rows.map((r) => ({
      id: r.id,
      title: r.title,
      author: r.author,
      career: r.career,
      type: r.type,
      description: r.description,
      file: r.filename.startsWith('http') ? r.filename : `/uploads/${r.filename}`,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      originalName: r.originalName,
      isActive: r.is_active,
    }));

  } catch (error) {
    console.error("Error cargando publicaciones en el servidor:", error);
  }

  return (
    <HomeClient publications={publications} user={user} />
  );
}