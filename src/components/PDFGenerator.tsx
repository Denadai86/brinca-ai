// src/components/PDFGenerator.tsx (FINAL E COMPLETO)

"use client";

import React from "react";
import { jsPDF } from "jspdf";

interface PDFGeneratorProps {
    atividade: string;
    numero: number;
    titulo: string; // Título já vem limpo e validado pelo StyledPDF
}

// Mapeamento exato dos campos que o Gemini deve retornar
const FIELD_MAP = [
    "Objetivo pedagógico",
    "Idade/Turma ideal",
    "Duração",
    "Materiais necessários",
    "Passo a passo",
    "Variação (opcional)",
];

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ atividade, numero, titulo }) => {
    
    const handleDownload = () => {
        const doc = new jsPDF();
        
        // --- 1. PARSING DA ATIVIDADE BRUTA ---
        const lines = atividade.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        const fields: Record<string, string> = {};
        let currentField: string | null = null;
        
        // Ignora a linha do título (pois já a usamos) e o marcador ✨
        let contentLines = lines.filter(line => !line.startsWith('✨')).slice(0); 

        // Lógica de parsing: atribui linhas ao campo correto
        contentLines.forEach(line => {
            // Verifica se a linha começa com um cabeçalho de campo (ex: "Objetivo pedagógico:")
            const isFieldHeader = FIELD_MAP.find(field => line.startsWith(field + ':'));
            
            if (isFieldHeader) {
                currentField = isFieldHeader;
                // Armazena o conteúdo, removendo o cabeçalho "Campo:"
                fields[currentField] = line.substring(line.indexOf(':') + 1).trim();
            } else if (currentField) {
                // Adiciona linhas subsequentes ao campo atual
                fields[currentField] += '\n' + line;
            }
        });

        // --- 2. GERAÇÃO DO PDF ---
        let y = 20;
        
        // Configuração do Título Principal
        doc.setFontSize(20);
        doc.setTextColor(120, 40, 180); // Roxo
        doc.text(`Atividade ${numero}`, 10, y); 
        
        y += 8;
        
        // Subtítulo (Título da Brincadeira)
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40); // Cinza Escuro
        doc.text(titulo, 10, y);
        
        y += 7;
        
        // Linha Divisória
        doc.setDrawColor(180, 120, 220); // Roxo Claro
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        
        y += 10;
        
        // --- Desenho do Conteúdo Estruturado ---
        doc.setFontSize(12);
        
        FIELD_MAP.forEach(field => {
            const content = fields[field]?.trim();
            if (content) {
                // Título do Campo em Negrito e Roxo
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(120, 40, 180); 
                doc.text(field + ':', 10, y);
                y += 6;

                // Conteúdo do Campo em Normal e Cinza Escuro
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(40, 40, 40);
                
                // Quebrar o conteúdo em linhas para o PDF
                const contentLines = doc.splitTextToSize(content, 180) as string[];
                
                contentLines.forEach((line: string) => {
                    doc.text(line, 10, y);
                    y += 6;
                });
                
                y += 3; // Espaço extra entre os campos
                
                // Adicionar nova página se necessário
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
            }
        });

        // --- Rodapé ---
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Feito com carinho para professores do Brasil ❤️", 105, 285, { align: "center" });
        
        // Nome do arquivo: Usa o título limpo, substituindo espaços por hífens.
        const safeFileName = titulo.replace(/\s+/g, "-").toLowerCase();
        doc.save(`Brinca-AI-atividade-${numero}-${safeFileName}.pdf`);
    };

    return (
        <button
            onClick={handleDownload}
            type="button"
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-xl transition shadow-md whitespace-nowrap"
        >
            Baixar Atividade {numero} 📄
        </button>
    );
};

export default PDFGenerator;