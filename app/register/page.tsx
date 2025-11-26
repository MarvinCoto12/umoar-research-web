"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  // --- ALMACÉN DE DATOS TEMPORALES ---
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); 
  const [mensaje, setMensaje] = useState(""); 
  const router = useRouter();

  // --- (Protección de Ruta) ---
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        // CAMBIO: Llamamos a la API interna de Next.js
        const res = await fetch("/api/check_session");
        const data = await res.json();

        // Solo los ADMIN pueden ver esta página.
        if (!data.success || data.usuario.role !== "admin") {
          router.push("/"); 
        }
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    };
    verificarSesion();
  }, [router]);

  // --- PROCESO DE REGISTRO ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setMensaje("");

    try {
      // CAMBIO: Enviamos los datos a la API interna de registro
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_completo: nombre, email, password, role }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMensaje(`Usuario registrado: ${email}`);
        setNombre("");
        setEmail("");
        setPassword("");
        setRole("user"); 
      } else {
        setMensaje(data.message || data.error || "Error desconocido");
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error de conexión con el servidor");
    }
  };

  // --- CERRAR SESIÓN ---
  const handleLogout = async () => {
    try {
      // CAMBIO: Llamada simple a la API interna de logout
      await fetch("/api/logout"); 
      router.push("/"); 
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  };

  // --- INTERFAZ VISUAL ---
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Registrar Usuarios</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Correo @umoar.edu.sv"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 rounded">
          <option value="user">Usuario normal</option>
          <option value="admin">Administrador</option>
        </select>
        
        <button type="submit" className="mt-1.5 w-fit mx-auto px-6 font-bold bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors cursor-pointer">
          Registrar
        </button>

        {/* CAMBIO IMPORTANTE: type="button" para evitar que envíe el formulario al cerrar sesión */}
        <button 
          type="button"
          onClick={handleLogout} 
          className="mt-2 w-fit mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </form>

      {mensaje && <p className="mt-2 text-black text-center">{mensaje}</p>}
    </div>
  );
}