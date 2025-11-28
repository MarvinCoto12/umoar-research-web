'use client';
import { useState, useEffect } from 'react'; // Importamos useEffect
import { useRouter } from 'next/navigation'; // Importamos useRouter
import React from 'react';
import Layout from '../components/MainLayout';

type Props = {
  onSave?: (data: FormData) => void;
};

export default function UploadForm({ onSave }: Props) {
  // --- ESTADO DEL FORMULARIO ---
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [career, setCareer] = useState('');
  const [type, setType] = useState<'Institucional' | 'Catedra'>('Institucional');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const router = useRouter(); // Hook de navegación

  // --- NUEVO: PROTECCIÓN DE RUTA (El Guardián) ---
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch("/api/check_session");
        const data = await res.json();

        // Si NO hay sesión, lo mandamos al login inmediatamente
        if (!data.success) {
          router.push("/login");
        }
        // Nota: Aquí no validamos rol 'admin' porque los investigadores ('user')
        // SÍ tienen permiso de ver esta página.
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };
    verificarSesion();
  }, [router]);

  // --- MANEJO DE ARCHIVOS (PDF) ---
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;

    if (f) {
      if (f.type !== 'application/pdf') {
        alert('Solo se aceptan archivos PDF.');
        e.target.value = '';
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande (Máximo 10MB).');
        e.target.value = '';
        return;
      }
      setFile(f);
      setMessage(null);
    }
  }

  // --- QUITAR ARCHIVO ---
  function handleRemoveFile(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    const fileInput = document.getElementById('pdf-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  // --- ENVÍO DEL FORMULARIO ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!title || !author || !career || !file) {
      setMessage({ text: "Por favor completa todos los campos obligatorios y selecciona un archivo.", type: 'error' });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('career', career);
      formData.append('type', type);
      formData.append('description', description);
      formData.append('file', file);

      // SIMULACIÓN (Aquí iría el fetch real a /api/upload)
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Datos enviados:", Object.fromEntries(formData));

      setMessage({ text: 'Investigación publicada correctamente.', type: 'success' });

      setTitle('');
      setAuthor('');
      setCareer('');
      setDescription('');
      setFile(null);
      const fileInput = document.getElementById('pdf-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error(error);
      setMessage({ text: 'Hubo un error al subir la investigación.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Layout>
      <div className="bg-white text-black py-8 px-6 rounded-xl shadow-lg container mx-auto border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-900">
          Publicar Nueva Investigación
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Título de la Investigación <span className="text-red-500">*</span></label>
            <input
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Impacto de la tecnología..."
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Autor(es) <span className="text-red-500">*</span></label>
            <input
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ej: Juan Pérez, María López"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Carrera <span className="text-red-500">*</span></label>
            <input
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              placeholder="Ej: Ingeniería en Sistemas"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Tipo de Investigación <span className="text-red-500">*</span></label>
            <select
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={type}
              onChange={(e) => setType(e.target.value as 'Institucional' | 'Catedra')}
            >
              <option value="Institucional">Institucional</option>
              <option value="Catedra">Cátedra</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Descripción (opcional)</label>
            <textarea
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 text-black h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción del contenido..."
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Documento PDF <span className="text-red-500">*</span></label>

            <input
              id="pdf-input"
              type="file"
              accept="application/pdf"
              onChange={handleFile}
              className="hidden"
            />

            <label
              htmlFor="pdf-input"
              className={`p-4 rounded-lg cursor-pointer flex justify-between items-center border-2 border-dashed transition-all ${file
                  ? 'bg-green-50 border-green-500'
                  : 'bg-gray-50 border-gray-300 hover:border-green-400 hover:bg-gray-100'
                }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-2xl">{file ? '📄' : 'Empty'}</span>
                <span className={`font-medium truncate ${file ? "text-green-800" : "text-gray-500"}`}>
                  {file ? file.name : "Haz clic para seleccionar un archivo PDF"}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {file && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700 bg-white p-1.5 rounded-full shadow-sm hover:shadow transition-all"
                    title="Quitar archivo"
                  >
                    ✕
                  </button>
                )}

                {!file && (
                  <span className="bg-white text-gray-700 text-sm px-4 py-1.5 rounded shadow-sm border border-gray-200 font-medium">
                    Explorar
                  </span>
                )}
              </div>
            </label>
            {file && <p className="text-xs text-green-600 mt-1 text-right">Archivo listo para subir ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
          </div>

          {message && (
            <div className={`p-3 rounded text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isUploading}
              className={`
                w-full md:w-auto px-8 py-3 rounded-lg font-bold text-white shadow-md transition-all
                ${isUploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-700 hover:bg-green-800 hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5'}
              `}
            >
              {isUploading ? 'Subiendo...' : 'Publicar Investigación'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}