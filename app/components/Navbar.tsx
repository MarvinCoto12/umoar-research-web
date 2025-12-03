'use client';
import Link from 'next/link';
import { useState } from 'react';
import { User } from '@/types';
import { usePathname } from 'next/navigation';

type Props = {
  user: User | null;
};

export default function Navbar({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const isLoggedIn = !!user;
  const userRole = user?.role;
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout");
      window.location.href = "/";
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  };

  // Función para cerrar menú (usada en links y backdrop)
  const closeMenu = () => setOpen(false);

  // Configuración de enlaces
  const navLinks = [
    {
      label: 'Inicio',
      href: '/',
      // Mostrar Inicio si estamos en /forms o /dashboard
      show: pathname === '/forms' || pathname === '/dashboard'
    },
    {
      label: 'Publicar',
      href: '/forms',
      // Siempre mostrar
      show: true
    },
    {
      label: 'Panel de control',
      href: '/dashboard',
      // Siempre mostrar 
      show: true
    },
    {
      label: 'Registrar usuarios',
      href: '/register',
      show: userRole === 'admin'
    },
  ];

  return (
    <>
      {/* NAVBAR FIJA */}
      <nav className="fixed top-0 left-0 w-full bg-green-900 text-white px-4 py-3 flex justify-between items-center z-50 shadow-md">

        {/* IZQUIERDA: LOGO */}
        <div>
          <Link href="/" onClick={closeMenu}>
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

        {/* CENTRO: MENÚ PRINCIPAL (Móvil y PC) */}
        <div className={`
          items-center transition-all duration-200 ease-in-out
          ${open
            ? 'flex flex-col absolute top-full left-0 w-full bg-green-900 px-6 pt-5 pb-5 shadow-xl border-t border-green-800 gap-4 z-50'
            : 'hidden md:flex md:gap-6'
          }
        `}>
          {isLoggedIn && (
            <>
              {navLinks.map((link) => (
                link.show && (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`
                      text-white w-full md:w-auto text-lg md:text-base py-2 md:py-0 transition-colors
                      ${pathname === link.href
                        ? 'underline decoration-2 underline-offset-4 font-bold text-green-100'
                        : 'hover:text-green-200 hover:underline'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                )
              ))}

              {/* MÓVIL: USUARIO Y SALIR */}
              <div className="md:hidden w-full border-t border-green-800 mt-2 pt-4 flex items-center justify-between">
                <button
                  onClick={() => { handleLogout(); closeMenu(); }}
                  className="cursor-pointer text-red-400 hover:text-red-300 font-bold text-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Cerrar sesión
                </button>
                <div className="flex flex-col items-end">
                  <p className="text-xs text-green-300 font-semibold uppercase">Usuario conectado</p>
                  <p className="text-sm font-bold text-white truncate max-w-[200px]" title={user?.email}>{user?.email}</p>
                </div>
              </div>
            </>
          )}

          {/* BOTÓN LOGIN */}
          {!isLoggedIn && (
            <Link
              href="/login"
              onClick={closeMenu}
              className="md:ml-230 bg-green-800 hover:bg-green-700 text-white text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg border border-green-700 shadow-sm w-full md:w-auto justify-center md:justify-start mb-1 md:mb-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Acceso Administrativo
            </Link>
          )}
        </div>

        {/* DERECHA: USUARIO Y HAMBURGUESA */}
        <div className="flex items-center gap-5">

          {/* Usuario PC */}
          {isLoggedIn && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="text-white hover:underline flex items-center gap-1 font-medium"
                aria-expanded={accountOpen}
                aria-haspopup="true"
              >
                {user?.nombre?.split(' ')[0]} ▾
              </button>

              {accountOpen && (
                <>
                  {/* Backdrop transparente para cerrar menú de usuario en PC */}
                  <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />

                  <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-48 flex flex-col p-2 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 mb-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Usuario conectado</p>
                      <p className="text-sm font-bold truncate" title={user?.email}>{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="cursor-pointer text-left w-full hover:bg-red-50 text-red-600 font-medium px-3 py-2 rounded transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Botón Hamburguesa */}
          <button
            className="cursor-pointer flex flex-col gap-1 md:hidden p-2 z-50 relative"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <span className={`w-6 h-[3px] bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-[3px] bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-[3px] bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

        </div>
      </nav>

      {/*BACKDROP*/}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 md:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  );
}