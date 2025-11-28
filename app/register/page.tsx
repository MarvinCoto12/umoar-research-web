"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  // --- 1. LÓGICA DEL SISTEMA (Backend & Estado) ---
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [mensaje, setMensaje] = useState("");
  const [submitting, setSubmitting] = useState(false); // Estado visual para el botón
  const router = useRouter();

  // Protección de Ruta (Solo Admin)
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch("/api/check_session");
        const data = await res.json();
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

  // Envío de Datos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_completo: nombre, email, password, role }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMensaje(`¡Éxito! Usuario registrado: ${email}`);
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  // --- 2. DISEÑO VISUAL (Estilos Inline) ---
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #14532d, #f0fdf4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          padding: 36,
          borderRadius: 12,
          boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
        }}
      >
        <h2 style={{ margin: 0, marginBottom: 8, color: "#14532d", textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}>
          Registrar Usuarios
        </h2>
        <p style={{ marginTop: 0, marginBottom: 24, color: "#6b7280", textAlign: "center", fontSize: "0.9rem" }}>
          Panel administrativo para crear nuevas cuentas.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Nombre */}
          <label style={{ fontSize: 13, color: "#333", fontWeight: 600 }}>
            Nombre completo
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. María Pérez"
              required
              style={{
                width: "100%",
                marginTop: 6,
                padding: "10px 12px",
                fontSize: 15,
                borderRadius: 8,
                border: "1px solid #ddd",
                outline: "none",
                transition: "border 0.2s"
              }}
            />
          </label>

          {/* Email */}
          <label style={{ fontSize: 13, color: "#333", fontWeight: 600 }}>
            Correo @umoar.edu.sv
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@umoar.edu.sv"
              required
              style={{
                width: "100%",
                marginTop: 6,
                padding: "10px 12px",
                fontSize: 15,
                borderRadius: 8,
                border: "1px solid #ddd",
                outline: "none",
              }}
            />
          </label>

          {/* Contraseña */}
          <label style={{ fontSize: 13, color: "#333", fontWeight: 600 }}>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              style={{
                width: "100%",
                marginTop: 6,
                padding: "10px 12px",
                fontSize: 15,
                borderRadius: 8,
                border: "1px solid #ddd",
                outline: "none",
              }}
            />
          </label>

          {/* Rol Selector */}
          <label style={{ fontSize: 13, color: "#333", fontWeight: 600 }}>
            Tipo de Usuario
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                marginTop: 6,
                padding: "10px 12px",
                fontSize: 15,
                borderRadius: 8,
                border: "1px solid #ddd",
                outline: "none",
                backgroundColor: "white"
              }}
            >
              <option value="user">Investigador</option>
              <option value="admin">Administrador</option>
            </select>
          </label>

          {/* Botón Registrar */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 10,
              padding: "12px 14px",
              borderRadius: 8,
              border: "none",
              background: submitting ? "#86efac" : "#15803d",
              color: "#fff",
              fontSize: 15,
              fontWeight: "bold",
              cursor: submitting ? "default" : "pointer",
              transition: "background 0.2s"
            }}
          >
            {submitting ? "Registrando..." : "Registrar Usuario"}
          </button>

          {/* Botón Volver (Gris suave para diferenciar) */}
          <button
            type="button"
            onClick={handleGoHome}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              background: "#f1f5f9",
              color: "#475569",
              fontSize: 14,
              fontWeight: "600",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            Volver a la página pública
          </button>

        </form>

        {/* Mensajes de Feedback */}
        {mensaje && (
          <div style={{
            marginTop: 18,
            padding: "10px",
            borderRadius: 6,
            textAlign: "center",
            fontSize: 14,
            backgroundColor: mensaje.includes("Éxito") ? "#dcfce7" : "#fee2e2",
            color: mensaje.includes("Éxito") ? "#166534" : "#991b1b"
          }}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}