'use client';
import { useState } from 'react';
import React from 'react';
import Layout from '../components/Layout';

type Props = {
  onSave: (research: {
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
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [career, setCareer] = useState('');
  const [type, setType] = useState<'Institucional' | 'Catedra'>('Institucional');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  function uuidv4() {
    return crypto.randomUUID();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.type !== 'application/pdf') {
      alert('Solo se aceptan archivos PDF');
      e.target.value = '';
      return;
    }
    setFile(f);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const id = uuidv4();
    const objUrl = file ? URL.createObjectURL(file) : undefined;

    const research = {
      id,
      title,
      author,
      career,
      type,
      description,
      file: objUrl,
      image: '/mnt/data/2a77e9de-421f-4b3f-b730-fef8f595e6ad.png'
    };

    onSave(research);

    setTitle('');
    setAuthor('');
    setCareer('');
    setDescription('');
    setFile(null);
    (document.getElementById('pdf-input') as HTMLInputElement).value = '';

    alert('Investigación agregada (demo, frontend-only).');
  }

  return (
    <Layout>
    <div className="bg-white text-black py-10 px-6 rounded-xl shadow-lg container mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6 text-accent-purple">
        Publicar nueva investigación
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Título</label>
          <input
            className="p-3 rounded-md bg-gray-100 text-black outline-none focus:ring-2 focus:ring-accent-purple"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Autor(es)</label>
          <input
            className="p-3 rounded-md bg-gray-100 text-black outline-none focus:ring-2 focus:ring-accent-purple"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Carrera</label>
          <input
            className="p-3 rounded-md bg-gray-100 text-black outline-none focus:ring-2 focus:ring-accent-purple"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Tipo</label>
          <select
            className="p-3 rounded-md bg-gray-100 text-black outline-none focus:ring-2 focus:ring-accent-purple"
            value={type}
            onChange={(e) => setType(e.target.value as 'Institucional' | 'Catedra')}
          >
            <option value="Institucional">Institucional</option>
            <option value="Catedra">Catedra</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Descripción (opcional)</label>
          <textarea
            className="p-3 rounded-md bg-gray-100 text-black h-28 resize-none outline-none focus:ring-2 focus:ring-accent-purple"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Archivo PDF</label>
          <input
            id="pdf-input"
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="p-3 rounded-md bg-gray-100 text-black cursor-pointer outline-none focus:ring-2 focus:ring-accent-pink"
          />
          {file && (
            <small className="text-accent-pink mt-1">
              Archivo listo: {file.name}
            </small>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="bg-accent-purple hover:bg-accent-pink transition-colors duration-300 text-white font-semibold px-6 py-3 rounded-lg shadow-lg"
          >
            Publicar investigación
          </button>
        </div>
      </form>
    </div>
    </Layout>
  );
}
