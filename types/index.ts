export type User = {
  id: number;
  nombre: string;
  email: string;
  role: string;
};

export type Publication = {
  id: number;
  title: string;
  author: string;
  career?: string; 
  type?: string;
  description?: string;
  file?: string; // URL del archivo
  filename?: string; // Nombre físico (útil para el admin)
  originalName?: string;
  createdAt: string; 
  uploader?: {
    id: number;
    nombre: string;
  };
};