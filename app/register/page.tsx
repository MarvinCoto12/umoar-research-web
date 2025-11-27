"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // Ensure admin exists (same behaviour as login page)
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminExists = users.find((u: any) => u.email === "admin@umoar.edu");
    if (!adminExists) {
      users.push({
        name: "Administrador",
        email: "admin@umoar.edu",
        password: "admin123",
        role: "admin",
      });
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, []);

  function validate() {
    const e: { [k: string]: string } = {};

    if (!form.name.trim()) e.name = "Ingrese su nombre completo.";
    if (!form.email.trim()) e.email = "Ingrese su correo universitario.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Correo no válido.";

    // opcional: exigir dominio universitario (descomentar si lo quieres)
    // if (!form.email.endsWith(".edu")) e.email = "Use un correo universitario (.edu).";

    if (!form.password) e.password = "Ingrese una contraseña.";
    else if (form.password.length < 6)
      e.password = "La contraseña debe tener al menos 6 caracteres.";

    if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden.";

    // comprobar si el correo ya existe
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (form.email && users.find((u: any) => u.email === form.email)) {
      e.email = "Ya existe una cuenta con ese correo.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const newUser = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: "user",
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      alert("Registro exitoso. Ahora puede iniciar sesión.");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar. Intente nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #1d3557, #457b9d)",
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
        <h2 style={{ margin: 0, marginBottom: 8, color: "#1d3557" }}>
          Crear cuenta
        </h2>
        <p style={{ marginTop: 0, marginBottom: 18, color: "#555" }}>
          Regístrate con tu correo universitario para publicar investigaciones.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontSize: 13, color: "#333" }}>
            Nombre completo
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej. María Pérez"
              style={{
                width: "100%",
                marginTop: 6,
                padding: "10px 12px",
                fontSize: 15,
                borderRadius: 8,
                border: errors.name ? "1px solid #e74c3c" : "1px solid #ddd",
                outline: "none",
              }}
            />
            {errors.name && (
              <div style={{ color: "#e74c3c", fontSize: 12, marginTop: 6 }}>{errors.name}</div>
            )}
          </label>

          <label style={{ fontSize: 13, color: "#333" }}>
            Correo universitario
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ejemplo@universidad.edu.sv"
              type="email"
              style={{
                width: "100%",
                marginTop: 6,
                padding: "10px 12px",
                fontSize: 15,
                borderRadius: 8,
                border: errors.email ? "1px solid #e74c3c" : "1px solid #ddd",
                outline: "none",
              }}
            />
            {errors.email && (
              <div style={{ color: "#e74c3c", fontSize: 12, marginTop: 6 }}>{errors.email}</div>
            )}
          </label>

          <label style={{ fontSize: 13, color: "#333" }}>
            Contraseña
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              type="password"
              style={{
                width: "100%",
                marginTop: 6,
                padding: "10px 12px",
                fontSize: 15,
                borderRadius: 8,
                border: errors.password ? "1px solid #e74c3c" : "1px solid #ddd",
                outline: "none",
              }}
            />
            {errors.password && (
              <div style={{ color: "#e74c3c", fontSize: 12, marginTop: 6 }}>{errors.password}</div>
            )}
          </label>

          <label style={{ fontSize: 13, color: "#333" }}>
            Confirmar contraseña
            <input
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Repite la contraseña"
              type="password"
              style={{
                width: "100%",
                marginTop: 6,
                padding: "10px 12px",
                fontSize: 15,
                borderRadius: 8,
                border: errors.confirm ? "1px solid #e74c3c" : "1px solid #ddd",
                outline: "none",
              }}
            />
            {errors.confirm && (
              <div style={{ color: "#e74c3c", fontSize: 12, marginTop: 6 }}>{errors.confirm}</div>
            )}
          </label>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 6,
              padding: "12px 14px",
              borderRadius: 8,
              border: "none",
              background: submitting ? "#9fb6c7" : "#1d3557",
              color: "#fff",
              fontSize: 15,
              cursor: submitting ? "default" : "pointer",
            }}
            onMouseOver={(e) => {
              if (!submitting) (e.currentTarget.style.background = "#27496d");
            }}
            onMouseOut={(e) => {
              if (!submitting) (e.currentTarget.style.background = "#1d3557");
            }}
          >
            {submitting ? "Guardando..." : "Crear cuenta"}
          </button>
        </form>

        <div style={{ marginTop: 14, fontSize: 14, color: "#555" }}>
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            style={{ color: "#457b9d", textDecoration: "none", fontWeight: 600 }}
          >
            Inicia sesión
          </a>
        </div>
      </div>
    </div>
  );
}
