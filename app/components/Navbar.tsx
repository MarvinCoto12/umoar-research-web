'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Llamada a la API interna de Next.js
      await fetch("/api/logout");
      router.push("/"); // Redirige al login tras cerrar sesión
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  }

  return (
    <nav className="w-full bg-green-900 text-white px-5 py-3 flex justify-between relative z-50">
      
      {/* IZQUIERDA */}
      <div>
        <Link href="/home">
          <div className="text-2xl font-bold cursor-pointer">UMOAR</div>
        </Link>
      </div>

      {/* CENTRO */}
      <div className={`gap-6 md:flex 
        ${open ? 'flex flex-col absolute top-14 left-0 w-full bg-green-700 px-4 py-4 md:static shadow-lg md:shadow-none' : 'hidden'}
      `}>
        <Link href="/home" className="text-white hover:underline">Inicio</Link>
        <Link href="/forms" className="text-white hover:underline">Dashboard</Link>
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-5">

        {/* BOTÓN HAMBURGUESA (solo móvil) */}
        <button
          className="cursor-pointer flex flex-col gap-1 md:hidden"
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
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40 flex flex-col p-3 z-50">
              
              <button 
                onClick={handleLogout} 
                className="text-left hover:bg-gray-100 px-2 py-1 rounded w-full"
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
