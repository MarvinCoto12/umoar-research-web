import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// --- POST: SUBIR ARCHIVO ---
export async function POST(request: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.usuario) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title')?.toString() ?? '';
    const author = formData.get('author')?.toString() ?? '';
    const career = formData.get('career')?.toString() ?? '';
    const type = formData.get('type')?.toString() ?? '';
    const description = formData.get('description')?.toString() ?? '';

    // Validaciones
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'Archivo faltante' }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'Solo se aceptan archivos PDF' }, { status: 400 });
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'Archivo demasiado grande' }, { status: 400 });
    }

    // 1. Guardar archivo físico en public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    // Aseguramos que la carpeta exista
    await fs.mkdir(uploadsDir, { recursive: true });

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${timestamp}_${safeName}`;
    const filePath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // 2. Insertar en la Base de Datos (MySQL)
    const createdAt = new Date().toISOString();
    
    // NOTA: Si esta consulta falla, el archivo físico quedará "huérfano" en la carpeta.
    // En un sistema avanzado, aquí haríamos un "rollback" borrando el archivo si falla el SQL.
    try {
      await pool.query(
        `INSERT INTO publicaciones (id, filename, original_name, title, author, career, type, description, uploader_id, uploader_name, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          timestamp, // Usamos timestamp como ID simple
          filename,
          file.name,
          title,
          author,
          career,
          type,
          description,
          session.usuario.id,
          session.usuario.nombre,
          createdAt,
        ]
      );
    } catch (dbErr) {
      console.error("Error DB:", dbErr);
      // Opcional: Borrar el archivo si falla la DB para no dejar basura
      await fs.unlink(filePath).catch(() => {}); 
      return NextResponse.json({ success: false, error: 'Error al guardar en base de datos' }, { status: 500 });
    }

    return NextResponse.json({ success: true, file: `/uploads/${filename}` });

  } catch (error) {
    console.error('Error uploads POST:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

// --- GET: LISTAR ARCHIVOS ---
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, filename, original_name AS originalName, title, author, career, type, description, uploader_id AS uploaderId, uploader_name AS uploaderName, created_at AS createdAt
        FROM publicaciones
        ORDER BY created_at DESC`
    );

    const list = rows.map((r) => ({
      id: r.id,
      filename: r.filename,
      originalName: r.originalName,
      title: r.title,
      author: r.author,
      career: r.career,
      type: r.type,
      description: r.description,
      uploader: r.uploaderId ? { id: r.uploaderId, nombre: r.uploaderName } : null,
      createdAt: r.createdAt,
      file: `/uploads/${r.filename}`, // Construimos la URL pública
    }));

    return NextResponse.json({ success: true, list });

  } catch (error) {
    console.error('Error GET uploads:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener publicaciones' }, { status: 500 });
  }
}

// --- DELETE: ELIMINAR ARCHIVO ---
export async function DELETE(request: Request) {
    try {
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
        
        if (!session.usuario) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
        }

        const { filename } = await request.json();
        if (!filename) return NextResponse.json({ success: false, error: 'Falta filename' }, { status: 400 });

        // 1. Verificar Permisos (Consultar dueño en DB)
        const [rows] = await pool.query<RowDataPacket[]>("SELECT uploader_id FROM publicaciones WHERE filename = ?", [filename]);
        
        if (rows.length === 0) {
            return NextResponse.json({ success: false, error: 'Publicación no encontrada' }, { status: 404 });
        }

        const ownerId = rows[0].uploader_id;
        const isAdmin = session.usuario.role === 'admin';
        const isOwner = ownerId === session.usuario.id;

        if (!isAdmin && !isOwner) {
            return NextResponse.json({ success: false, error: 'No tienes permiso para eliminar esto' }, { status: 403 });
        }

        // 2. Borrar archivo físico
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
        try {
            await fs.unlink(filePath);
        } catch (err) {
            console.warn(`Archivo físico no encontrado: ${filename}`);
        }

        // 3. Borrar registro de la Base de Datos
        await pool.query("DELETE FROM publicaciones WHERE filename = ?", [filename]);

        return NextResponse.json({ success: true, message: "Eliminado correctamente" });

    } catch (error) {
        console.error("Error DELETE:", error);
        return NextResponse.json({ success: false, error: "Error al eliminar" }, { status: 500 });
    }
}