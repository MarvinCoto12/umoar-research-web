'use client';
import Link from 'next/link';
import { useState } from 'react';
import { User } from '@/types';

// Props del Navbar
type Props = {
  user: User | null;
};

export default function Navbar({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const isLoggedIn = !!user;
  const userRole = user?.role;

  const handleLogout = async () => {
    try {
      await fetch("/api/logout");
      // Forzamos recarga completa para limpiar cookies y estado de la app
      window.location.href = "/";
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-green-900 text-white px-4 py-3 flex justify-between items-center z-50 shadow-md">

      {/* IZQUIERDA: LOGO */}
      <div>
        <Link href="/">
          <div className="text-2xl font-bold cursor-pointer flex items-center gap-2">
            <span>
              UMOAR
            </span>
            
            {isLoggedIn && (
              <span className="text-xs bg-green-700 text-green-100 px-2 py-1 rounded uppercase tracking-wider font-normal">
                Intranet
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* CENTRO: ENLACES */}
      <div className={`gap-6 md:flex 
        ${open ? 'flex flex-col absolute top-full left-0 w-full bg-green-900 px-4 py-4 md:static shadow-lg md:shadow-none' : 'hidden'}
      `}>
        {isLoggedIn && (
          <Link href="/" className="text-white hover:text-green-200 hover:underline transition-colors">
            Inicio
          </Link>
        )}

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

      {/* DERECHA: USUARIO / MENÚ MÓVIL */}
      <div className="flex items-center gap-5">

        {/* Botón Hamburguesa (Móvil) */}
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
              className="text-white hover:underline flex items-center gap-1 font-medium"
            >
              {user?.nombre.split(' ')[0]} ▾ {/* Mostramos el primer nombre para personalizar */}
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-48 flex flex-col p-2 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-100">

                <div className="px-3 py-2 mb-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold uppercase">
                    Conectado como
                  </p>
                  <p className="text-sm font-bold truncate" title={user?.email}>{user?.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-left w-full hover:bg-red-50 text-red-600 font-medium px-3 rounded transition-colors flex items-center gap-2"
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