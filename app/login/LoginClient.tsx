"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginClient() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Forzar la navegación para que el Router de Next.js refresque el estado
                router.refresh();
                router.push("/dashboard");
            } else {
                setMensaje(data.error || "Usuario o contraseña incorrectos");
                setIsLoading(false); // Solo dejamos de cargar si hubo error
            }
        } catch (err) {
            console.error(err);
            setMensaje("Error de conexión con el servidor");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="p-8 max-w-sm w-full bg-white shadow-xl rounded-xl border border-gray-100">
                <h1 className="text-center text-3xl font-bold mb-6 text-green-800">
                    Acceso UMOAR
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Correo@umoar.edu.sv"
                        value={email}
                        maxLength={30}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
                    />

                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`mt-4 w-full py-3 rounded-lg font-bold text-white transition-colors shadow-md cursor-pointer ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
                            }`}
                    >
                        {isLoading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>

                {mensaje && <p className="mt-4 text-center text-red-600 font-medium">{mensaje}</p>}

                <div className="mt-6 text-center">
                    <a href="/" className="text-sm text-gray-500 hover:text-green-700 hover:underline transition-colors">
                        ← Volver a Investigaciones Públicas
                    </a>
                </div>
            </div>
        </div>
    );
}