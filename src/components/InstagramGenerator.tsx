"use client";

import { Instagram } from "lucide-react";
// Importações mantidas comentadas para uso futuro quando reativar a feature
// import { useRef, useState } from "react";
// import { Download, Lock } from "lucide-react";
// import html2canvas from "html2canvas";

interface InstagramGeneratorProps {
  activity: {
    tema: string;
    target: string;
    content: string;
  };
}

export function InstagramGenerator({ activity }: InstagramGeneratorProps) {
  // const postRef = useRef<HTMLDivElement>(null);
  // const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    // Feature desativada temporariamente.
    // O código original foi preservado comentado para reativação futura.
    /*
    if (!postRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(postRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `post-instagram-${activity.tema}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Erro ao gerar post:", err);
    } finally {
      setIsGenerating(false);
    }
    */
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Área de Visualização do Post (Hidden enquanto desativado) */}
      <div className="hidden">
        <div
          // ref={postRef}
          className="w-[1080px] h-[1080px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-16 flex flex-col justify-center items-center text-white text-center relative overflow-hidden"
          style={{ fontFamily: "sans-serif" }}
        >
          <h2 className="text-6xl font-bold mb-8">{activity.tema}</h2>
          <p className="text-3xl">{activity.target}</p>
        </div>
      </div>

      {/* Botão Modificado: Desativado + Badge */}
      <button
        disabled
        onClick={handleDownload}
        title="Funcionalidade em manutenção"
        className="group relative flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-400 cursor-not-allowed transition-all opacity-80 hover:opacity-100"
      >
        {/* Badge "Em Breve" Flutuante */}
        <span className="absolute -top-2.5 -right-2 bg-indigo-100 text-indigo-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-200 shadow-sm z-10 whitespace-nowrap">
          EM BREVE
        </span>

        <Instagram size={18} />
        <span className="font-medium text-xs sm:text-sm">Gerar Post</span>
      </button>

      {/* Texto de apoio opcional (pode remover se poluir muito o card) */}
      {/* <p className="text-center text-[10px] text-slate-400 mt-1 hidden sm:block">
        Voltamos logo! 🎨
      </p> */}
    </div>
  );
}