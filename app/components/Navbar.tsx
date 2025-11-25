'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  }

  return (
    <nav className="w-full bg-blue-900 text-white px-5 py-3 flex justify-between ">
      
      {/* IZQUIERDA */}
      <div>
        <Link href="/">
          <div className="text-2xl font-bold cursor-pointer">UMOAR</div>
        </Link>
      </div>

      {/* CENTRO */}
      <div className={`gap-6 md:flex 
        ${open ? 'flex flex-col absolute top-14 left-0 w-full bg-blue-900 px-4 py-4 md:static' : 'hidden'}
      `}>
        <Link href="/" className="text-white hover:underline">Inicio</Link>
        <Link href="/forms" className="text-white hover:underline">Dashboard</Link>
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-5">

        {/* BOTÓN HAMBURGUESA (solo móvil) */}
        <button
          className="flex flex-col gap-1 md:hidden"
          onClick={() => setOpen(!open)}
        >
          <span className="w-6 h-[3px] bg-white"></span>
          <span className="w-6 h-[3px] bg-white"></span>
          <span className="w-6 h-[3px] bg-white"></span>
        </button>

        {/* CUENTA */}
        <div className="relative">
          <button 
            onClick={() => setAccountOpen(!accountOpen)} 
            className="text-white hover:underline"
          >
            Cuenta ▾
          </button>

          {accountOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40 flex flex-col p-3">
            
              <button 
                onClick={logout} 
                className="text-left hover:bg-gray-100 px-2 py-1 rounded"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

      </div>

    </nav>
  );
}
