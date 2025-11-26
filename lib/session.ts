import { SessionOptions } from "iron-session";

export interface SessionData {
  usuario?: {
    id: number;
    nombre: string;
    email: string;
    role: string;
  };
}

// Aseguramos que la clave de encriptación exista. 
// Si la clave no es de al menos 32 caracteres, Next.js fallará.
if (!process.env.SESSION_PASSWORD || process.env.SESSION_PASSWORD.length < 32) {
    throw new Error("La variable de entorno SESSION_PASSWORD debe estar definida y tener al menos 32 caracteres.");
}

export const sessionOptions: SessionOptions = {
  // Ahora usa la clave del archivo .env.local
  password: process.env.SESSION_PASSWORD, 
  cookieName: "umoar_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", 
  },
};