// src/components/VideoDemonstracao.tsx

"use client";

import React, { useState } from 'react';
import { PlayCircle, XCircle } from 'lucide-react';

// === COLOQUE A URL DO SEU VÍDEO AQUI! ===
// Deve ser o link de INCORPORAÇÃO, por exemplo: "https://www.youtube.com/embed/XXXXXXXXX"
const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/c9AKqVhJudg"; 

export function VideoDemonstracao() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mt-8 mb-4 flex justify-center">
      
      {/* O BOTÃO */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-6 py-3 text-lg font-semibold text-red-700 bg-white rounded-full shadow-md transition-all duration-300 hover:bg-red-50 hover:shadow-lg border-2 border-red-200"
      >
        <PlayCircle className="w-6 h-6" />
        Assistir Demonstração Rápida
      </button>

      {/* O MODAL/OVERLAY */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4" 
          onClick={() => setIsModalOpen(false)}
        >
          
          <div 
            className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-4 md:p-6"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Fechar vídeo"
              >
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            {/* Vídeo Responsivo (16:9) */}
            <div className="relative pt-[56.25%]"> 
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={YOUTUBE_EMBED_URL}
                title="Demonstração do Brinca-AI"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}