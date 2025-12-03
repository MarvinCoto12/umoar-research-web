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
    const [searchTerm, setSearchTerm] = useState("");

    const closeModal = () => setSelectedPub(null);

    const filteredPublications = publications.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout user={user}>
            <div className="px-4 pb-6 pt-0 sm:px-6"> {/* Padding reducido en móvil */}

                <HeroSlider />

                <header className="mb-5 text-center">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-black">
                        Bienvenido a la plataforma de Proyectos de Investigación de Monseñor Oscar Arnulfo Romero
                    </h1>
                    <p className="mt-1.5 text-gray-600 text-lg sm:block">
                        Aquí podrás encontrar las investigaciones publicadas por nuestra institución.
                    </p>
                </header>

                <div>
                    <div className="mb-6 sm:mb-8 flex justify-center">
                        <div style={{ maxWidth: "350px", margin: "0 auto", width: "100%" }}>
                            <div className="flex items-center w-full rounded-full border-[3px] border-gray-700 bg-green-50 px-4 transition-colors duration-200 focus-within:border-gray-500">
                                <input
                                    id="search-input"
                                    name="search"
                                    type="text"
                                    maxLength={30}
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="grow bg-transparent text-gray-700! px-2 py-2 text-base sm:text-lg placeholder-gray-500 border-0! outline-none! ring-0! shadow-none!"
                                    style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                                />

                                <div className="h-8 w-2px bg-gray-400 mx-2 sm:mx-3"></div>
                                <svg
                                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 cursor-pointer shrink-0"
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
                {/* grid-cols-2 en móvil con gap pequeño (gap-3) */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
                    {filteredPublications.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-base sm:text-lg">
                                No hay publicaciones disponibles.
                            </p>
                        </div>
                    ) : (
                        filteredPublications.map((p) => (
                            <article
                                key={p.id}
                                onClick={() => setSelectedPub(p)}
                                className="group bg-white border border-gray-200 rounded-lg sm:rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden hover:-translate-y-1 active:scale-95"
                            >
                                <div className="h-2 sm:h-3 bg-linear-to-r from-green-700 to-green-500 w-full"></div>

                                {/* Padding reducido en móvil (p-3), escritorio (sm:p-6) */}
                                <div className="p-3 sm:p-6 flex flex-col grow">
                                    <div className="flex justify-between items-start mb-2 sm:mb-4">
                                        {/* Badge más pequeño en móvil */}
                                        <span className="bg-green-50 text-green-700 text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider truncate max-w-[100px]">
                                            {p.type || 'General'}
                                        </span>
                                        {/* Fecha oculta en móvil para ahorrar espacio */}
                                        <span className="text-gray-400 text-xs hidden sm:block">
                                            {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}
                                        </span>
                                    </div>

                                    {/* Título ajustado para móvil */}
                                    <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-3 line-clamp-3 sm:line-clamp-2 group-hover:text-green-700 transition-colors leading-tight">
                                        {p.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-2 sm:mb-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-[10px] sm:text-xs font-bold shrink-0">
                                            {p.author.charAt(0).toUpperCase()}
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                                            {p.author}
                                        </p>
                                    </div>

                                    {/* Descripción: Oculta en móvil (hidden sm:block) */}
                                    {p.description && (
                                        <p className="text-sm text-gray-500 line-clamp-3 mb-6 grow hidden sm:block">
                                            {p.description}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-2 sm:pt-4 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm">
                                        {/* Carrera truncada en móvil */}
                                        <span className="text-gray-500 font-medium truncate max-w-[120px] sm:max-w-none">
                                            {p.career}
                                        </span>

                                        {/* Texto 'Ver detalles' oculto en móvil, solo ícono o nada */}
                                        <span className="text-green-700 font-bold items-center gap-1 group-hover:underline hidden sm:flex">
                                            Ver detalles
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {/* MODAL DE DETALLE */}
                {selectedPub && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center sm:p-6 bg-black/70 backdrop-blur-sm transition-all" onClick={closeModal}>
                        <div
                            // w-full h-full en móvil (pantalla completa real), esquinas cuadradas. 
                            // En PC (sm:) estilo de ventana con bordes redondeados.
                            className="bg-white w-full h-full sm:h-[90vh] sm:w-full sm:max-w-6xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header Modal */}
                            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-100 bg-white z-10 shrink-0">
                                <div className="pr-4">
                                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 line-clamp-2" title={selectedPub.title}>{selectedPub.title}</h2>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        Publicado por {selectedPub.author}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="cursor-pointer bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 p-2 rounded-full transition-all shrink-0"
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
                                <div className="w-full lg:w-1/3 p-5 sm:p-8 overflow-y-auto bg-white border-r border-gray-200 shadow-sm z-10 order-2 lg:order-1">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                Descripción Completa
                                            </h4>
                                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                                {selectedPub.description || "No hay una descripción detallada para este documento."}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ficha Técnica</h4>
                                            <div className="grid grid-cols-1 gap-2 text-sm">
                                                <div className="flex justify-between"><span className="text-gray-500">Carrera:</span> <span className="font-medium text-gray-900 text-right">{selectedPub.career}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">Tipo:</span> <span className="font-medium text-gray-900 text-right">{selectedPub.type}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">Fecha:</span> <span className="font-medium text-gray-900 text-right">{selectedPub.createdAt ? new Date(selectedPub.createdAt).toLocaleDateString() : 'N/A'}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">Archivo:</span> <span className="font-medium text-gray-900 text-right">{selectedPub.originalName}</span></div>
                                            </div>
                                        </div>

                                        {selectedPub.file && (
                                            <div className="space-y-3 pb-8 lg:pb-0">
                                                <a
                                                    href={selectedPub.file}
                                                    download
                                                    className="flex items-center justify-center w-full gap-2 bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-green-700/20 active:scale-95"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                    Descargar PDF
                                                </a>

                                                {/* Botón extra móvil */}
                                                <a
                                                    href={selectedPub.file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="lg:hidden flex items-center justify-center w-full gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                    Abrir PDF
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Panel Derecho: Visor PDF */}
                                <div className="w-full lg:w-2/3 bg-gray-200 relative flex flex-col justify-center order-1 lg:order-2 h-[200px] lg:h-auto border-b lg:border-b-0 border-gray-200 shrink-0">
                                    {selectedPub.file ? (
                                        <>
                                            <iframe
                                                src={`${selectedPub.file}#toolbar=0&view=FitH`}
                                                className="w-full h-full absolute inset-0 md:block hidden"
                                                title="Vista previa del PDF"
                                            />
                                            <div className="md:hidden w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gray-100">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    <p className="text-gray-500 text-sm font-medium">Vista previa no disponible</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
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