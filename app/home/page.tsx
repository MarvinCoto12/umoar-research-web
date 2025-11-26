"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from '../components/MainLayout';

export default function Home() {
  // Estado del usuario
  const [usuario, setUsuario] = useState<{ nombre: string; email: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        // CAMBIO: Llamamos a la API interna de Next.js
        // Ya no es necesario 'credentials: "include"' porque es el mismo dominio
        const res = await fetch("/api/check_session");
        const data = await res.json();

        // Verificamos si la sesión es válida y si el rol es 'user'
        if (!data.success || data.usuario.role !== "user") {
          router.push("/"); // Redirige al login si no hay sesión o no es user
        } else {
          setUsuario(data.usuario);
        }
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    };
    verificarSesion();
  }, [router]);

  // Pantalla de carga mientras se verifica la sesión
  if (!usuario) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Bienvenido a la plataforma de Proyectos de Investigación de Monseñor Oscar Arnulfo Romero
        </h1>

        {/* Puedes agregar más contenido de la página aquí */}
      </div>
    </Layout>
  );
}