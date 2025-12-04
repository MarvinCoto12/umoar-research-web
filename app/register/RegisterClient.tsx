"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterClient() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [mensaje, setMensaje] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

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

            if (password.length < 6) {
                setMensaje("Error: La contraseña debe tener al menos 6 caracteres.");
                return;
            }

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

    return (
        <div className="min-h-screen bg-linear-to-br from-green-900 to-green-50 flex justify-center items-center p-5">
            <div className="w-full max-w-md bg-white p-9 rounded-xl shadow-2xl">
                <h2 className="text-green-900 text-center text-2xl font-bold mb-2">
                    Registrar Usuarios
                </h2>
                <p className="text-gray-500 text-center text-sm mb-6">
                    Panel administrativo para crear nuevas cuentas.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">

                    {/* Nombre */}
                    <label className="text-sm text-gray-800 font-semibold">
                        Nombre completo
                        <input
                            type="text"
                            value={nombre}
                            maxLength={40}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej. María Pérez"
                            required
                            autoComplete="off"
                            className="w-full mt-2 p-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                        />
                    </label>

                    {/* Email */}
                    <label className="text-sm text-gray-800 font-semibold">
                        Correo Institucional
                        <input
                            type="email"
                            value={email}
                            maxLength={35}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ej: 1234567@umoar.edu.sv"
                            required
                            autoComplete="off"
                            className="w-full mt-2 p-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Formato: Máximo 7 dígitos + @umoar.edu.sv
                        </p>
                    </label>

                    {/* Contraseña */}
                    <label className="text-sm text-gray-800 font-semibold">
                        Contraseña
                        <input
                            type="password"
                            value={password}
                            maxLength={20}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            required
                            autoComplete="new-password"
                            className="w-full mt-2 p-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                        />
                    </label>

                    {/* Rol Selector */}
                    <label className="text-sm text-gray-800 font-semibold">
                        Tipo de Usuario
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full mt-2 p-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                        >
                            <option value="user">
                                Investigador
                            </option>

                            <option value="admin">
                                Administrador
                            </option>
                        </select>
                    </label>

                    {/* Botón para registrar */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`cursor-pointer mt-4 w-full py-3 rounded-lg font-bold text-white transition-colors shadow-md ${submitting ? "bg-green-300 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
                            }`}
                    >
                        {submitting ? "Registrando..." : "Registrar Usuario"}
                    </button>

                    {/* Botón para volver a la pag principal */}
                    <button
                        type="button"
                        onClick={handleGoHome}
                        className="cursor-pointer py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors text-sm"
                    >
                        Volver a la página principal
                    </button>
                </form>

                {/* Mensajes de Feedback */}
                {mensaje && (
                    <div
                        className={`mt-6 p-3 rounded-lg text-center text-sm font-medium ${mensaje.includes("Éxito")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                    >
                        {mensaje}
                    </div>
                )}
            </div>
        </div>
    );
}