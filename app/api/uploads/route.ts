import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { pool } from '@/lib/db';

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

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${timestamp}_${safeName}`;
    const filePath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Guardar metadata en JSON local `data/uploads.json`
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    const jsonPath = path.join(dataDir, 'uploads.json');

    let list: any[] = [];
    try {
      const existing = await fs.readFile(jsonPath, 'utf8');
      list = JSON.parse(existing);
      if (!Array.isArray(list)) list = [];
    } catch (e) {
      list = [];
    }

    const newItem = {
      id: timestamp,
      filename,
      originalName: file.name,
      title,
      author,
      career,
      type,
      description,
      uploader: session.usuario,
      createdAt: new Date().toISOString(),
    };

    // Intentar insertar en la base de datos si existe pool
    let dbInserted = false;
    try {
      // La tabla recomendada es `publicaciones` (ver SQL más abajo en README o comentarios)
      await pool.query(
        `INSERT INTO publicaciones (id, filename, original_name, title, author, career, type, description, uploader_id, uploader_name, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newItem.id,
          newItem.filename,
          newItem.originalName,
          newItem.title,
          newItem.author,
          newItem.career,
          newItem.type,
          newItem.description,
          newItem.uploader?.id ?? null,
          newItem.uploader?.nombre ?? newItem.uploader?.email ?? null,
          newItem.createdAt,
        ]
      );
      dbInserted = true;
    } catch (dbErr) {
      // Si falla (p. ej. tabla no existe), caemos al almacenamiento en JSON
      console.warn('No fue posible insertar en BD, usando archivo JSON:', (dbErr as any)?.message ?? dbErr);
    }

    if (!dbInserted) {
      list.push(newItem);
      await fs.writeFile(jsonPath, JSON.stringify(list, null, 2), 'utf8');
    }

    return NextResponse.json({ success: true, file: `/uploads/${filename}`, meta: newItem, storedInDB: dbInserted });
  } catch (error) {
    console.error('Error en uploads API:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Intentar leer desde la base de datos
    try {
      const [rows]: any = await pool.query(
        `SELECT id, filename, original_name AS originalName, title, author, career, type, description, uploader_id AS uploaderId, uploader_name AS uploaderName, created_at AS createdAt
         FROM publicaciones
         ORDER BY created_at DESC`
      );

      const list = (rows || []).map((r: any) => ({
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
        file: `/uploads/${r.filename}`,
      }));

      return NextResponse.json({ success: true, list });
    } catch (dbErr) {
      // Si falla la DB (tabla no existe, etc) fallback al JSON local
      console.warn('No fue posible leer de BD, usando archivo JSON:', (dbErr as any)?.message ?? dbErr);
      const dataDir = path.join(process.cwd(), 'data');
      const jsonPath = path.join(dataDir, 'uploads.json');
      try {
        const existing = await fs.readFile(jsonPath, 'utf8');
        const list = JSON.parse(existing);
        return NextResponse.json({ success: true, list });
      } catch (e) {
        return NextResponse.json({ success: true, list: [] });
      }
    }
  } catch (error) {
    console.error('Error en GET uploads API:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
