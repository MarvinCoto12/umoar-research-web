"use client";
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const SLIDES = [
    '/img/universidad1.jpg',
    '/img/monseñor.jpg',
    '/img/universidad.jpg',
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    };

    // Auto y manual-slide
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentSlide, nextSlide]);

    return (
        <div className="w-full md:max-w-3xl mx-auto mb-3.5">
            {/* Contenedor Flex: Botón - Imagen - Botón */}
            <div className="flex items-center gap-2 md:gap-4">

                {/* BOTÓN IZQUIERDO (Visible siempre, más pequeño en móvil) */}
                <button
                    onClick={prevSlide}
                    className="cursor-pointer shrink-0 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-100 text-green-700 shadow-sm border border-gray-200 transition-all active:scale-95"
                    aria-label="Anterior"
                >
                    <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* VENTANA DEL SLIDER */}
                {/* Altura: 200px en móvil (h-[200px]), 200px en escritorio (md:h-[400px]) */}
                <div className="relative w-full h-[200px] md:h-[220px] overflow-hidden rounded-xl md:rounded-2xl shadow-md bg-gray-200">

                    {/* Imágenes */}
                    {SLIDES.map((src, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                        >
                            <Image
                                src={src}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
                                priority={index === 0}
                            />
                        </div>
                    ))}

                    {/* Zona táctil invisible (para facilitar el clic en móviles sobre la foto) */}
                    <div className="absolute inset-0 flex md:hidden z-20">
                        <div className="w-1/2 h-full" onClick={prevSlide}></div>
                        <div className="w-1/2 h-full" onClick={nextSlide}></div>
                    </div>

                    {/* Indicadores (Puntitos) */}
                    <div className="absolute bottom-2 left-0 w-full flex justify-center gap-1.5 z-20">
                        {SLIDES.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${currentSlide === index ? "bg-white w-4 opacity-100" : "bg-white/50 w-1.5 hover:bg-white"
                                    }`}
                                aria-label={`Ir a diapositiva ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* BOTÓN DERECHO (Visible siempre, más pequeño en móvil) */}
                <button
                    onClick={nextSlide}
                    className="cursor-pointer shrink-0 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-100 text-green-700 shadow-sm border border-gray-200 transition-all active:scale-95"
                    aria-label="Siguiente"
                >
                    <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}