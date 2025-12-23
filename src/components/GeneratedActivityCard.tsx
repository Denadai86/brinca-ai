"use client";

import { InstagramGenerator } from "@/components/InstagramGenerator";

interface GeneratedActivityCardProps {
  content: string;
  index: number;
}

export function GeneratedActivityCard({
  content,
  index,
}: GeneratedActivityCardProps) {
  return (
    <article className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-purple-600">
          Atividade Gerada #{index + 1}
        </span>
      </div>

      <div className="text-sm text-slate-600 whitespace-pre-line">
        {content.replace(/\[.*?\]/g, "")}
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end w-full sm:w-auto">
        <div className="w-32"> {/* Container para limitar largura */}
          {/* ✅ CORREÇÃO: Adaptando as props antigas para o novo objeto 'activity' */}
          <InstagramGenerator
            activity={{
              tema: "Atividade Educativa", // Valor padrão
              target: "Geral",             // Valor padrão
              content: content
            }}
          />
        </div>
      </div>
    </article>
  );
}