"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from '../components/MainLayout';

export default function Home() {
  const [usuario, setUsuario] = useState<{ nombre: string; email: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch("/api/check_session");
        const data = await res.json();

        // CAMBIO 1: Si no hay sesión válida, mandamos al LOGIN (no a la portada)
        if (!data.success) {
          router.push("/login");
        } else {
          // CAMBIO 2: Permitimos entrar si hay sesión, sin importar si es 'user' o 'admin'
          // Antes tenías: if (role !== "user") -> lo cual bloqueaba a los admins.
          setUsuario(data.usuario);
        }
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };
    verificarSesion();
  }, [router]);

  if (!usuario) return <div className="p-10 text-center text-gray-500">Cargando intranet...</div>;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-black mb-6">
          Bienvenido a la plataforma de Proyectos de Investigación de Monseñor Oscar Arnulfo Romero
        </h1>

        {/* Panel de Bienvenida */}
        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded shadow-sm">
          <p className="text-green-800 text-lg">
            Has ingresado correctamente como: <strong>{usuario.nombre}</strong>
          </p>
          <p className="text-sm text-green-700 mt-1">
            Rol actual: <span className="uppercase font-bold">{usuario.role}</span>
          </p>
        </div>

        {/* Accesos Rápidos (Opcional, para que no se vea vacío) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-white text-black">
            <h3 className="font-bold text-xl mb-2">Gestionar Publicaciones</h3>
            <p className="text-gray-600 mb-4">Sube nuevas investigaciones en formato PDF.</p>
            <a href="/forms" className="text-green-700 font-medium hover:underline">Ir a Publicar &rarr;</a>
          </div>

          {usuario.role === 'admin' && (
            <div className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-white text-black">
              <h3 className="font-bold text-xl mb-2">Administrar Usuarios</h3>
              <p className="text-gray-600 mb-4">Registra nuevos administradores/investigadores en el sistema.</p>
              <a href="/register" className="text-green-700 font-medium hover:underline">Ir a Registro &rarr;</a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}