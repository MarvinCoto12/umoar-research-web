'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/check_session");
        const data = await res.json();
        if (data.success) {
          setIsLoggedIn(true);
          setUserRole(data.usuario.role);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch (err) {
        console.error("Error al verificar sesión en Navbar", err);
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout");

      // CAMBIO CLAVE: Usamos window.location.href en lugar de router.push
      // Esto fuerza una recarga de la página, limpiando el estado de la portada pública
      window.location.href = "/";

    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-green-900 text-white px-4 py-3 flex justify-between items-center z-50 shadow-md ">

      {/* IZQUIERDA */}
      <div>
        <Link href="/">
          <div className="text-2xl font-bold cursor-pointer flex items-center gap-2">
            <span>UMOAR</span>
            {isLoggedIn && (
              <span className="text-xs bg-green-700 text-green-100 px-2 py-1 rounded uppercase tracking-wider font-normal">
                Intranet
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* CENTRO */}
      <div className={`gap-6 md:flex 
        ${open ? 'flex flex-col absolute top-full left-0 w-full bg-green-900 px-4 py-4 md:static shadow-lg md:shadow-none' : 'hidden'}
      `}>
        <Link href="/" className="text-white hover:text-green-200 hover:underline
        transition-colors">Inicio</Link>

        {isLoggedIn && (
          <Link href="/forms" className="text-white hover:text-green-200 hover:underline transition-colors">
            Publicar
          </Link>
        )}

        {userRole === 'admin' && (
          <Link href="/register" className="text-white hover:text-green-200 hover:underline transition-colors">
            Registrar usuarios
          </Link>
        )}
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-5">

        <button
          className="cursor-pointer flex flex-col gap-1 md:hidden"
          onClick={() => setOpen(!open)}
        >
          <span className="w-6 h-[3px] bg-white"></span>
          <span className="w-6 h-[3px] bg-white"></span>
          <span className="w-6 h-[3px] bg-white"></span>
        </button>

        {isLoggedIn && (
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="text-white hover:underline flex items-center gap-1"
            >
              Cuenta ▾
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40 flex flex-col p-3 z-50 border border-gray-100">

                <div className="px-2 pb-2 mb-2 border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase">
                  Opciones
                </div>

                <button
                  onClick={handleLogout}
                  className="text-left w-full hover:bg-red-50 text-red-600 font-medium px-2 py-2 rounded transition-colors"
                >
                  Cerrar sesión
                </button>

              </div>
            )}
          </div>
        )}

      </div>
    </nav>
  );
}