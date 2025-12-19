// src/components/StyledPDF.tsx

import React from "react";
import PDFGenerator from "./PDFGenerator";

interface StyledPDFProps {
    atividade: string; // A string bruta da IA
    numero: number;
}

// Função para remover emojis, caracteres especiais e evitar quebras de codificação
const sanitizeTitle = (title: string): string => {
    if (!title) return `Atividade ${title}`;
    
    // 1. Remove emojis (complexo, mas funcional)
    let safeTitle = title.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
    
    // 2. Remove outros caracteres não alfanuméricos que causam problemas no PDF ou nome do arquivo
    safeTitle = safeTitle.replace(/[^\w\s\-\.\áéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ]/g, '').trim();

    return safeTitle;
}

const StyledPDF: React.FC<StyledPDFProps> = ({ atividade, numero }) => {
    let rawTitle = `Atividade ${numero}`;
    
    // 1. Extrai a primeira linha (que deve ser o título)
    const firstLine = atividade.trim().split('\n')[0] || rawTitle;
    
    // 2. Remove o marcador '✨' (se existir)
    rawTitle = firstLine.replace('✨', '').trim(); 

    // 3. Validação de Segurança: Se a primeira linha ainda for um campo (ex: "Objetivo pedagógico:"), 
    //    usamos um título padrão para evitar nome de arquivo confuso.
    if (rawTitle.toLowerCase().startsWith('objetivo pedagógico') || rawTitle.toLowerCase().startsWith('idade/turma ideal')) {
        rawTitle = `Atividade ${numero} Sem Título`;
    }

    // 4. Sanitiza o título para o PDF e nome do arquivo
    const tituloSanitizado = sanitizeTitle(rawTitle);
    
    return (
        <div className="flex justify-end">
            <PDFGenerator atividade={atividade} numero={numero} titulo={tituloSanitizado} />
        </div>
    );
};

export default StyledPDF;