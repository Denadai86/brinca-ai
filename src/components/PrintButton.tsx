//src/components/PrintButton.tsx

"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => {
        // Muda o título da página temporariamente para o nome do arquivo sair bonito
        const originalTitle = document.title;
        // O navegador usa o document.title como sugestão de nome de arquivo
        document.title = "Atividade Brinca-AI"; 
        window.print();
        document.title = originalTitle; // Restaura depois
      }}
      className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 font-bold border border-white/20"
      title="Salvar como PDF / Imprimir"
    >
      <Printer size={20} />
      <span className="hidden md:inline">Baixar PDF / Imprimir</span>
    </button>
  );
}