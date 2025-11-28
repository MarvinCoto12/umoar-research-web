"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from './components/MainLayout';

type Publication = {
  id: number;
  title: string;
  author: string;
  career?: string;
  type?: string;
  description?: string;
  file?: string;
  createdAt?: string;
};

export default function PublicHome() {
  // Estado para saber si hay sesión activa
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publications, setPublications] = useState<Publication[]>([]);

  // Verificamos si hay sesión al cargar la página
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/check_session");
        const data = await res.json();
        if (data.success) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Error verificando sesión en portada", err);
      }
    };
    checkSession();

    // Obtener publicaciones
    const fetchPublications = async () => {
      try {
        const r = await fetch('/api/uploads');
        const json = await r.json();
        if (json.success && Array.isArray(json.list)) {
          setPublications(json.list);
        } else if (Array.isArray(json)) {
          // por compatibilidad, si la API devuelve directamente un array
          setPublications(json as Publication[]);
        }
      } catch (err) {
        console.error('Error cargando publicaciones', err);
      }
    };
    fetchPublications();
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Bienvenido a la plataforma de Proyectos de Investigación de Monseñor Oscar Arnulfo Romero
        </h1>

        {/* --- ÁREA DE CONTENIDO PÚBLICO --- */}
        <div className="mt-8">
          <p className="text-gray-600 mb-6">
            Aquí podrás encontrar las investigaciones publicadas por nuestra institución.
          </p>

          <div className="grid gap-4">
            {publications.length === 0 ? (
              <p className="text-sm text-gray-500">No hay publicaciones aún.</p>
            ) : (
              publications.map((p) => (
                <div key={p.id} className="p-4 border rounded-md bg-white shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-black">{p.title}</h3>
                      <p className="text-sm text-gray-600">{p.author}</p>
                      {p.career && <p className="text-xs text-gray-500">{p.career} • {p.type}</p>}
                    </div>
                    {p.file && (
                      <a href={p.file} target="_blank" rel="noreferrer" className="text-sm bg-green-700 text-white px-3 py-1 rounded">
                        Ver PDF
                      </a>
                    )}
                  </div>
                  {p.description && <p className="mt-2 text-sm text-gray-700">{p.description}</p>}
                  {p.createdAt && <p className="mt-2 text-xs text-gray-400">Publicado: {new Date(p.createdAt).toLocaleString()}</p>}
                </div>
              ))
            )}
          </div>

          {/* Botón para que el personal administrativo inicie sesión */}
          <div className="mt-10 pt-10 border-t border-gray-200">
            {!isLoggedIn ? (
              <>
                <p className="text-sm text-gray-500 mb-2">¿Eres investigador o administrador?</p>
                <Link
                  href="/login"
                  className="inline-block bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors text-sm font-medium"
                >
                  Ingresar al Sistema
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-green-700 mb-2">Sesión activa</p>
                <Link
                  href="/home"
                  className="inline-block bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors text-sm font-bold"
                >
                  Ir a mi Panel de Control →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}