import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// POST: SUBIR ARCHIVO
export async function POST(request: Request) {

  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.usuario) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title')?.toString().trim() ?? '';
    const author = formData.get('author')?.toString().trim() ?? '';
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
    if (!title) {
      return NextResponse.json({ success: false, error: 'El título es obligatorio' }, { status: 400 });
    }
    if (!author) {
      return NextResponse.json({ success: false, error: 'El/los autor(es) es/son obligatorio/s' }, { status: 400 });
    }

    // SUBIDA A VERCEL BLOB
    // Subimos el archivo directamente a la nube
    const blob = await put(file.name, file, {
      access: 'public',
    });

    // Insertar en la Base de Datos (MySQL)
    const createdAt = new Date().toISOString();
    const timestamp = Date.now();

    // Ahora 'filename' guardará la URL completa de Vercel Blob
    const filename = blob.url;

    try {
      await pool.query(
        `INSERT INTO publicaciones (id, filename, original_name, title, author, career, type, description, uploader_id, uploader_name, created_at, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          timestamp,
          filename, // Guardamos la URL aquí
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
    
      return NextResponse.json({ success: false, error: 'Error al guardar en base de datos' }, { status: 500 });
    }

    return NextResponse.json({ success: true, file: blob.url });

  } catch (error) {
    console.error('Error uploads POST:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

// GET: LISTAR ARCHIVOS 
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, filename, original_name AS originalName, title, author, career, type, description, uploader_id AS uploaderId, uploader_name AS uploaderName, created_at AS createdAt
        FROM publicaciones
        WHERE is_active = 1  -- CAMBIO: Solo traer activas
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
  
      // Si el 'filename' empieza con http, es un Blob de Vercel.
      file: r.filename.startsWith('http') ? r.filename : `/uploads/${r.filename}`,
    }));

    return NextResponse.json({ success: true, list });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 });
  }
}

// CAMBIAR ESTADO (OCULTAR / ACTIVAR)
export async function PATCH(request: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.usuario) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const { filename, isActive } = await request.json();
    if (!filename || isActive === undefined) {
      return NextResponse.json({ success: false, error: 'Datos incompletos' }, { status: 400 });
    }

    // Verificar Permisos (Consultar dueño en DB)
    const [rows] = await pool.query<RowDataPacket[]>("SELECT uploader_id FROM publicaciones WHERE filename = ?", [filename]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Publicación no encontrada' }, { status: 404 });
    }

    const ownerId = rows[0].uploader_id;
    const isAdmin = session.usuario.role === 'admin';
    const isOwner = ownerId === session.usuario.id;

    // Solo el dueño o el admin pueden cambiar el estado
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ success: false, error: 'No tienes permiso para modificar esto' }, { status: 403 });
    }

    // Convertimos el boolean a 1 o 0 para MySQL
    const newStatus = isActive ? 1 : 0;
    await pool.query("UPDATE publicaciones SET is_active = ? WHERE filename = ?", [newStatus, filename]);

    return NextResponse.json({
      success: true,
      message: `Publicación ${isActive ? 'activada' : 'ocultada'} correctamente`
    });

  } catch (error) {
    console.error("Error PATCH (Cambiar estado):", error);
    return NextResponse.json({ success: false, error: "Error al actualizar estado" }, { status: 500 });
  }
}


// "OCULTAR" ARCHIVO
export async function DELETE(request: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.usuario) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const { filename } = await request.json();
    if (!filename) return NextResponse.json({ success: false, error: 'Falta filename' }, { status: 400 });

    // Verificar Permisos (Consultar dueño en DB)
    const [rows] = await pool.query<RowDataPacket[]>("SELECT uploader_id FROM publicaciones WHERE filename = ?", [filename]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Publicación no encontrada' }, { status: 404 });
    }

    const ownerId = rows[0].uploader_id;
    const isAdmin = session.usuario.role === 'admin';
    const isOwner = ownerId === session.usuario.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ success: false, error: 'No tienes permiso para desactivar esto' }, { status: 403 });
    }

    // UPDATE en lugar de DELETE
    await pool.query("UPDATE publicaciones SET is_active = 0 WHERE filename = ?", [filename]);

    return NextResponse.json({ success: true, message: "Publicación ocultada correctamente" });

  } catch (error) {
    console.error("Error DELETE (Ocultar):", error);
    return NextResponse.json({ success: false, error: "Error al ocultar" }, { status: 500 });
  }
}