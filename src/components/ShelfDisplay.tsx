// src/components/ShelfDisplay.tsx

import React from 'react';
// IMPORTAÇÃO CORRIGIDA com caminho relativo para evitar o erro de 'Module not found'
import ShelfData from '../data/prateleira.json'; 
import { Sparkles } from 'lucide-react';

// Importa os outros componentes
import StyledPDF from './StyledPDF'; // Se você o tiver em src/components
import { VideoDemonstracao } from './VideoDemonstracao';

// Função utilitária para extrair apenas a primeira atividade do bloco para o resumo
const parseActivities = (rawString: string) => {
    return rawString
        .split("✨")
        .filter(block => block.trim().length > 50)
        .slice(0, 1); // Exibe apenas a 1ª atividade de cada bloco
};

export const ShelfDisplay = () => {
    
    const activityData = ShelfData.map((item) => {
        return {
            ...item,
            // Adiciona o marcador ✨ novamente para o parse funcionar
            parsedActivities: parseActivities(`✨ ${item.atividade.trim()}`)
        }
    });

    return (
        <section className="mt-16 pt-8 border-t border-purple-200">
            
            {/* O botão/modal do vídeo aparece no topo da prateleira */}
            <VideoDemonstracao />
            
            <h2 className="text-3xl font-bold text-purple-700 text-center mb-10 flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-pink-500" />
                Inspirações da Prateleira
                <Sparkles className="w-6 h-6 text-blue-500" />
            </h2>
            
            <div className="space-y-12">
                {activityData.map((item, _mainIndex) => (
                    <div 
                        key={item.id} 
                        className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-blue-100"
                    >
                        <h3 className="text-xl font-bold text-blue-800 mb-4">
                            Tema: {item.tema}
                        </h3>
                        
                        {item.parsedActivities.length > 0 && (
                             <div className="space-y-6">
                                {item.parsedActivities.map((atividade, subIndex) => (
                                    <div key={subIndex}>
                                        <div className="text-lg text-purple-900 leading-relaxed whitespace-pre-wrap line-clamp-4">
                                            {/* Exibe o resumo da atividade */}
                                            ✨ {atividade.trim()} 
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            {/* Passa a atividade completa para o PDF */}
                                            <StyledPDF 
                                                atividade={`✨ ${atividade.trim()}`} 
                                                numero={item.id} 
                                            />
                                        </div>
                                    </div>
                                ))}
                             </div>
                        )}

                    </div>
                ))}
            </div>
        </section>
    );
}