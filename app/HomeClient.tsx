"use client";
import { useState } from 'react';
import Layout from './components/MainLayout';
import HeroSlider from './components/HeroSlider';
import { Publication, User } from '@/types';

type Props = {
    publications: Publication[];
    user: User | null;
};

export default function HomeClient({ publications, user }: Props) {
    const [selectedPub, setSelectedPub] = useState<Publication | null>(null);

    // Función para cerrar el modal
    const closeModal = () => setSelectedPub(null);

    return (
        <Layout user={user}>
            <div className="p-6">

                {/* SLIDER (Componente)*/}
                <HeroSlider />

                {/* HEADER DE BIENVENIDA */}
                <header className="mb-6 text-center">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-black mb-2">
                        Bienvenido a la plataforma de Proyectos de Investigación de Monseñor Oscar Arnulfo Romero
                    </h1>
                    <p className="mt-4 text-gray-600 text-lg">
                        Aquí podrás encontrar las investigaciones publicadas por nuestra institución.
                    </p>
                </header>

                <div>
                    {/*Implementando la barra de busqueda*/}
                    <div className="mb-8 flex justify-center">
                        <div style={{ maxWidth: "350px", margin: "0 auto" }}>
                            <div className="flex items-center w-full rounded-full border-[3px] border-gray-700 bg-green-50 px-4 transition-colors duration-200 focus-within:border-gray-500">
                                <input
                                    type="text"
                                    maxLength={30}
                                    placeholder="Buscar investigaciones..."
                                    className="grow bg-transparent text-gray-700! px-2 py-2 text-lg placeholder-gray-500 border-0! outline-none! ring-0! shadow-none!"
                                    style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                                />

                                <div className="h-8 w-2px bg-gray-400 mx-3"></div>
                                {/*Lupa dentro del mismo contenedor verde*/}
                                <svg
                                    className="w-6 h-6 text-gray-600 cursor-pointer shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <circle cx="11" cy="11" r="7" strokeWidth="2.5" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M21 21l-4.35-4.35"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GRID DE TARJETAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {publications.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-base sm:text-lg">
                                No hay publicaciones disponibles por el momento.
                            </p>
                        </div>
                    ) : (
                        publications.map((p) => (
                            <article
                                key={p.id}
                                onClick={() => setSelectedPub(p)}
                                className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden hover:-translate-y-1"
                            >
                                {/* Decoración superior */}
                                <div className="h-3 bg-linear-to-r from-green-700 to-green-500 w-full"></div>

                                <div className="p-6 flex flex-col grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {p.type || 'General'}
                                        </span>
                                        <span className="text-gray-400 text-xs">
                                            {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors leading-tight">
                                        {p.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                            {p.author.charAt(0).toUpperCase()}
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium truncate">
                                            {p.author}
                                        </p>
                                    </div>

                                    {p.description && (
                                        <p className="text-sm text-gray-500 line-clamp-3 mb-6 grow">
                                            {p.description}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                        <span className="text-gray-500 font-medium">{p.career}</span>
                                        <span className="text-green-700 font-bold flex items-center gap-1 group-hover:underline">
                                            Ver detalles
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {/* MODAL DE DETALLE (Pantalla Completa) */}
                {selectedPub && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm transition-all" onClick={closeModal}>
                        <div
                            className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header Modal */}
                            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white z-10">
                                <div className="pr-8">
                                    <h2 className="text-2xl font-bold text-gray-900 line-clamp-1" title={selectedPub.title}>{selectedPub.title}</h2>
                                    <p className="text-sm text-gray-500">
                                        Publicado por
                                        {selectedPub.author}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="cursor-pointer bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 p-2 rounded-full transition-all"
                                    title="Cerrar"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Cuerpo Modal */}
                            <div className="grow flex flex-col lg:flex-row overflow-hidden bg-gray-50">
                                {/* Panel Izquierdo: Información */}
                                <div className="w-full lg:w-1/3 p-6 lg:p-8 overflow-y-auto bg-white border-r border-gray-200 shadow-sm z-10">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                Descripción Completa
                                            </h4>
                                            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                                                {selectedPub.description || "No hay una descripción detallada para este documento."}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ficha Técnica</h4>
                                            <div className="grid grid-cols-1 gap-2 text-sm">
                                                <div className="flex justify-between"><span className="text-gray-500">Carrera:</span> <span className="font-medium text-gray-900 text-right">{selectedPub.career}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">Tipo:</span> <span className="font-medium text-gray-900 text-right">{selectedPub.type}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">Fecha:</span> <span className="font-medium text-gray-900 text-right">{selectedPub.createdAt ? new Date(selectedPub.createdAt).toLocaleDateString() : 'N/A'}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">Archivo:</span> <span className="font-medium text-gray-900 text-right truncate max-w-[150px]">{selectedPub.originalName}</span></div>
                                            </div>
                                        </div>

                                        {selectedPub.file && (
                                            <a
                                                href={selectedPub.file}
                                                download
                                                className="flex items-center justify-center w-full gap-2 bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-green-700/20 active:scale-95"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                Descargar PDF
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Panel Derecho: Visor PDF */}
                                <div className="w-full lg:w-2/3 bg-gray-200 relative">
                                    {selectedPub.file ? (
                                        <iframe
                                            src={`${selectedPub.file}#toolbar=0&view=FitH`}
                                            className="w-full h-full absolute inset-0"
                                            title="Vista previa del PDF"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                                            <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                                            <p>Vista previa no disponible</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}