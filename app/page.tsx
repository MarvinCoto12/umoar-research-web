"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // --- VARIABLES DE ESTADO ---
  // Aquí guardamos lo que el usuario escribe en tiempo real y los mensajes de error.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  
  // Herramienta para movernos a otras páginas (redireccionar)
  const router = useRouter();

  // --- LÓGICA DE ENVÍO ---
  // Esta función se ejecuta cuando presionas el botón "Ingresar"
  const handleSubmit = async (e: React.FormEvent) => {
    // 1. Evitamos que la página se recargue sola (comportamiento por defecto de los formularios)
    e.preventDefault();
    setMensaje(""); // Limpiamos errores previos

    try {
      // 2. Conectamos con tu Backend (PHP)
      // Le enviamos el usuario y contraseña para que verifique si existen.
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // IMPORTANTE: Esto permite guardar la "cookie" de sesión que crea PHP
        credentials: "include", 
        body: JSON.stringify({ email, password }),
      });

      // 3. Convertimos la respuesta del servidor a un formato legible
      const data = await res.json();

      // 4. Verificamos si el login fue exitoso
      if (data.success) {
        // --- SISTEMA DE ROLES ---
        // Dependiendo de quién eres, te envia a una página distinta
        if (data.role === "admin") {
          router.push("/register"); // El admin va a registrar usuarios
        } else if (data.role === "user") {
          router.push("/home");     // El user va al home normal
        } else {
          setMensaje("Tu usuario no tiene un rol válido asignado.");
        }
      } else {
        // Si el backend dice que falló (contraseña mal, usuario no existe, etc.)
        setMensaje(data.error || "Usuario o contraseña incorrectos");
      }
    } catch (err) {
      // 5. Si el servidor está apagado o no hay internet
      console.error(err);
      setMensaje("Error de conexión con el servidor");
    }
  };

  // --- INTERFAZ VISUAL (Lo que ve el usuario) ---
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-center text-xl font-bold mb-4">Login Universitario</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {/* Campo de Correo */}
        <input
          type="email"
          placeholder="0000000@umoar.edu.sv"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Actualiza la variable 'email' al escribir
          required
          className="border p-2 rounded"
        />
        
        {/* Campo de Contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Actualiza la variable 'password' al escribir
          required
          className="border p-2 rounded"
        />
        
        {/* Botón de envío */}
        <button type="submit" className="mt-2 w-fit mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer">
          Ingresar
        </button>
      </form>

      {/* Mensaje de Error: Solo se muestra si la variable 'mensaje' tiene texto */}
      {mensaje && <p className="mt-2 text-red-600">{mensaje}</p>}
    </div>
  );
}