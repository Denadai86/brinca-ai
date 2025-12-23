"use client";

import { 
  Package, 
  Target, 
  ClipboardList, 
  Quote, 
  Sparkles 
} from "lucide-react";
// Se tiver o componente StyledPDF, importe ele aqui. 
// Caso não tenha, comente a linha abaixo e a linha do <StyledPDF /> no return.
import StyledPDF from "./StyledPDF"; 

// Função Helper (Parser) movida para cá
function parseContent(text: string, tag: string) {
  const regex = new RegExp(`\\[${tag}\\](.*?)(?=\\[|$)`, "s");
  return text.match(regex)?.[1]?.trim() || "";
}

export function ActivityCard({ content, index }: { content: string; index: number }) {
  const titulo = parseContent(content, "TITULO");
  const motivacional = parseContent(content, "MOTIVACIONAL");
  const materiais = parseContent(content, "MATERIAIS");
  const pedagogico = parseContent(content, "PEDAGOGICO");
  const passos = parseContent(content, "PASSO_A_PASSO");

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden mb-8 transition-all hover:shadow-2xl">
      <div className="bg-slate-50 p-6 border-b flex flex-wrap justify-between items-center gap-4">
        <div>
           <h3 className="font-black text-slate-800 text-lg md:text-xl">{titulo || "Atividade Criativa"}</h3>
           <span className="inline-block mt-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
             Opção #{index + 1}
           </span>
        </div>
        {/* Componente de PDF opcional */}
        <div className="shrink-0">
           {/* <StyledPDF atividade={content} numero={index + 1} /> */}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {motivacional && (
          <div className="flex gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <Quote className="text-amber-400 shrink-0" size={20} />
            <p className="italic text-amber-800 text-sm font-medium">"{motivacional}"</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-pink-600 uppercase text-[10px] font-black tracking-widest">
              <Package size={14}/> Materiais
            </div>
            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-xl">
              {materiais || "Materiais simples diversos."}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 uppercase text-[10px] font-black tracking-widest">
              <Target size={14}/> Pedagógico
            </div>
            <p className="text-slate-600 text-sm leading-relaxed bg-blue-50/50 p-3 rounded-xl">
              {pedagogico || "Desenvolvimento cognitivo e motor."}
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-50">
          <div className="flex items-center gap-2 text-purple-600 uppercase text-[10px] font-black tracking-widest">
            <ClipboardList size={14}/> Passo a Passo
          </div>
          <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
            {passos}
          </p>
        </div>
        
        <div className="pt-4 flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase tracking-widest justify-center">
            <Sparkles size={12} /> Brinca-AI
        </div>
      </div>
    </div>
  );
}