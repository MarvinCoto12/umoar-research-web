"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from '../components/MainLayout';

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  role: string
};

type Publication = {
  id: number;
  title: string;
  author: string;
  filename: string;
  createdAt: string;
  uploader?: {
    id: number;
    nombre: string
  };
};

export default function Home() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
  const [loadingPubs, setLoadingPubs] = useState(true);
  const router = useRouter();

  // Cargar Sesión
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch("/api/check_session");
        const data = await res.json();
        if (!data.success) {
          router.push("/login");
        } else {
          setUsuario(data.usuario);
        }
      } catch (err) {
        router.push("/login");
      }
    };
    verificarSesion();
  }, [router]);

  // Cargar todas las Publicaciones
  const cargarPublicaciones = async () => {
    setLoadingPubs(true);
    try {
      const res = await fetch("/api/uploads");
      const data = await res.json();
      if (data.success) {
        setPublicaciones(data.list);
      }
    } catch (error) {
      console.error("Error cargando lista", error);
    } finally {
      setLoadingPubs(false);
    }
  };

  useEffect(() => {
    if (usuario) cargarPublicaciones();
  }, [usuario]);

  // Eliminar Documento
  const handleDelete = async (filename: string) => {
    if (!confirm("¿Estás seguro de eliminar este documento permanentemente?")) return;

    try {
      const res = await fetch("/api/uploads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Publicación eliminada correctamente.");
        cargarPublicaciones();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error de conexión.");
    }
  };

  // LÓGICA DE FILTRADO 
  // Si no hay usuario cargado, la lista está vacía.
  // Si es ADMIN: Muestra todo.
  // Si es USER: Filtra donde el uploader.id sea igual al usuario.id
  const filteredPubs = publicaciones.filter((pub) => {
    if (!usuario) return false;
    if (usuario.role === 'admin') return true; // Admin ve todo
    return pub.uploader?.id === usuario.id;    // Usuario ve solo lo suyo
  });

  if (!usuario) return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando panel...</div>;

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-500">Gestiona tus investigaciones y cuenta.</p>
        </header>

        {/* Tarjeta de Bienvenida */}
        <div className="bg-linear-to-r from-green-50 to-white border-l-4 border-green-600 p-6 rounded-r-xl shadow-sm mb-10">
          <h2 className="text-xl font-bold text-green-900">
            Hola, {usuario.nombre}
          </h2>
          <div className="flex items-center gap-3 mt-2 text-sm">
            <span className={`px-2 py-1 rounded font-bold uppercase text-xs tracking-wider ${usuario.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-200 text-green-900'
              }`}>
              {usuario.role === 'admin' ? 'Administrador General' : 'Investigador'}
            </span>
            <span className="text-gray-500">{usuario.email}</span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div
            onClick={() => router.push('/forms')}
            className="group cursor-pointer bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-400 transition-all flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-700">Nueva Investigación</h3>
              <p className="text-sm text-gray-500 mt-1">Publica nuevas investigaciones en formato PDF.</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
              ＋
            </div>
          </div>

          {usuario.role === 'admin' && (
            <div
              onClick={() => router.push('/register')}
              className="group cursor-pointer bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700">Registrar Usuarios</h3>
                <p className="text-sm text-gray-500 mt-1">Crear cuentas de acceso.</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                👤
              </div>
            </div>
          )}
        </div>

        {/* Tabla de Gestión */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {usuario.role === 'admin' ? 'Todas las Publicaciones' : 'Mis Publicaciones'}
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredPubs.length} documentos
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loadingPubs ? (
              <div className="p-10 text-center text-gray-400 animate-pulse">Cargando datos...</div>
            ) : filteredPubs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">No se encontraron publicaciones.</p>
                {usuario.role !== 'admin' && (
                  <button onClick={() => router.push('/forms')} className="mt-4 text-green-700 font-medium hover:underline">
                    Comienza subiendo tu primera investigación
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                      <th className="p-4 border-b">Título</th>
                      <th className="p-4 border-b">Autor</th>
                      {/* Solo el admin necesita ver la columna "Subido por", para el usuario es redundante */}
                      {usuario.role === 'admin' && <th className="p-4 border-b">Subido por</th>}
                      <th className="p-4 border-b">Fecha de publicación</th>
                      <th className="p-4 border-b text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredPubs.map((pub) => (
                      <tr key={pub.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900">{pub.title}</td>
                        <td className="p-4 text-gray-600">{pub.author}</td>

                        {usuario.role === 'admin' && (
                          <td className="p-4 text-gray-500">
                            {pub.uploader?.nombre || 'Desconocido'}
                          </td>
                        )}

                        <td className="p-4 text-gray-500">
                          {new Date(pub.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(pub.filename)}
                            className="text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-md transition-all font-medium text-xs border border-red-100 hover:border-red-600"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}