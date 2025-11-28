"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from './components/MainLayout';

export default function PublicHome() {
  // Estado para saber si hay sesión activa
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            (Próximamente se mostrará la lista de PDFs aquí).
          </p>

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