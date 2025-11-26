'use client';
import { useState } from 'react';
import React from 'react';
import Layout from '../components/MainLayout';

type Props = {
  onSave?: (research: {
    id: string;
    title: string;
    author: string;
    career: string;
    type: 'Institucional' | 'Catedra';
    description?: string;
    file?: string;
    image?: string;
  }) => void;
};

export default function UploadForm({ onSave }: Props) {
  // --- ESTADO DEL FORMULARIO ---
  // Aquí guardamos temporalmente lo que el usuario escribe o selecciona
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [career, setCareer] = useState('');
  const [type, setType] = useState<'Institucional' | 'Catedra'>('Institucional');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null); // Guardamos el archivo PDF real

  // Generador de IDs únicos (para identificar cada investigación internamente)
  function uuidv4() {
    return crypto.randomUUID();
  }

  // --- MANEJO DE ARCHIVOS (PDF) ---
  // Se ejecuta cuando el usuario selecciona un archivo desde su computadora
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    
    // Validación: Solo permitimos archivos PDF
    if (f && f.type !== 'application/pdf') {
      alert('Solo se aceptan archivos PDF');
      e.target.value = ''; // Limpiamos el input si el archivo es incorrecto
      return;
    }
    setFile(f); // Si es válido, lo guardamos en el estado
  }

  // --- QUITAR ARCHIVO ---
  // Permite al usuario arrepentirse y quitar el PDF seleccionado antes de enviar
  function handleRemoveFile(e: React.MouseEvent) {
    e.preventDefault();  // Evita comportamientos extraños del navegador
    e.stopPropagation(); // Evita que al hacer clic en la X, se active el botón "Explorar" de abajo
    
    setFile(null); // Borramos el archivo de la memoria del estado
    
    // Truco visual: Limpiamos también el input invisible de HTML para poder volver a seleccionar el mismo archivo si quisiera
    const fileInput = document.getElementById('pdf-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  // --- ENVÍO DEL FORMULARIO ---
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Evitamos que la página se recargue

    const id = uuidv4();
    // Creamos una URL temporal para previsualizar el PDF (útil si quisiéramos mostrarlo antes de subir)
    const objUrl = file ? URL.createObjectURL(file) : undefined;

    // Empaquetamos todos los datos en un solo objeto "Investigación"
    const research = {
      id,
      title,
      author,
      career,
      type,
      description,
      file: objUrl,
      // Imagen placeholder (esto se cambiaría por una subida real de imagen en el futuro)
      image: '/mnt/data/2a77e9de-421f-4b3f-b730-fef8f595e6ad.png'
    };

    // Si el componente padre nos dio una función 'onSave', la usamos. Si no, solo mostramos en consola.
    if (onSave) {
        onSave(research);
    } else {
        console.log("Datos listos para enviar:", research);
    }

    // --- LIMPIEZA ---
    // Dejamos el formulario en blanco para una nueva entrada
    setTitle('');
    setAuthor('');
    setCareer('');
    setDescription('');
    setFile(null);
    const fileInput = document.getElementById('pdf-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    alert('Investigación agregada (Frontend demo).');
  }

  // --- INTERFAZ VISUAL ---
  return (
    <Layout>
    <div className="bg-white text-black py-7 rounded-xl shadow-lg container mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6 text-accent-purple">
        Publicar nueva investigación
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        
        {/* Campo: Título */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Título</label>
          <input
            className="p-3 rounded-md bg-gray-100 border border-black text-black outline-none focus:ring-2 focus:ring-accent-purple"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Campo: Autor */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Autor(es)</label>
          <input
            className="p-3 rounded-md bg-gray-100 border border-black text-black outline-none focus:ring-2 focus:ring-accent-purple"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        {/* Campo: Carrera */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Carrera</label>
          <input
            className="p-3 rounded-md bg-gray-100 border border-black text-black outline-none focus:ring-2 focus:ring-accent-purple"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            required
          />
        </div>

        {/* Campo: Tipo (Selector) */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Tipo</label>
          <select
            className="p-3 rounded-md bg-gray-100 border border-black text-black outline-none focus:ring-2 focus:ring-accent-purple"
            value={type}
            onChange={(e) => setType(e.target.value as 'Institucional' | 'Catedra')}
          >
            <option value="Institucional">Institucional</option>
            <option value="Catedra">Catedra</option>
          </select>
        </div>

        {/* Campo: Descripción */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Descripción (opcional)</label>
          <textarea
            className="p-3 rounded-md bg-gray-100 border border-gray-400 text-black h-28 resize-none outline-none focus:ring-2 focus:ring-accent-purple"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* --- CAMPO ESPECIAL PARA ARCHIVOS PDF --- */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Archivo PDF</label>
          
          {/* 1. El input real está oculto porque es feo por defecto */}
          <input
            id="pdf-input"
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="hidden" 
          />
          
          {/* 2. Usamos un label personalizado como botón que activa el input oculto */}
          <label 
            htmlFor="pdf-input"
            className={`p-3 rounded-md cursor-pointer flex justify-between items-center border border-gray-400 hover:border-black transition-all ${file ? 'bg-green-100' : 'bg-gray-100'}`}
          >
            {/* Texto dinámico: Muestra "Seleccionar" o el nombre del archivo */}
            <span className={file ? "text-black font-medium truncate pr-2" : "text-gray-500"}>
                {file ? `Archivo listo: ${file.name}` : "Seleccionar archivo"}
            </span>
            
            <div className="flex items-center gap-3">
                {/* Botón X para eliminar: Solo aparece si hay un archivo cargado */}
                {file && (
                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-red-500 hover:text-red-700 font-bold p-1 rounded-full hover:bg-red-100 transition-colors flex items-center justify-center w-6 h-6"
                        title="Quitar archivo"
                    >
                        ✕
                    </button>
                )}
                
                {/* Botón visual "Explorar" */}
                <span className="bg-white text-black text-sm px-3 py-1 rounded shadow-sm border border-gray-300">
                    Explorar
                </span>
            </div>
          </label>
        </div>

        {/* Botón de Enviar */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="cursor-pointer bg-accent-purple hover:bg-accent-pink transition-colors duration-300 text-black font-semibold px-6 py-3 rounded-lg shadow-lg"
          >
            Publicar investigación
          </button>
        </div>
      </form>
    </div>
    </Layout>
  );
}
