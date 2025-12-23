"use client";

import PrintButton from "@/components/PrintButton";
import { InstagramGenerator } from "@/components/InstagramGenerator";
import { ShareActivity } from "@/components/ShareActivity";

interface ActivityActionsBarProps {
  content: string;
  theme: string;
  age: string;
}

export function ActivityActionsBar({ content, theme, age }: ActivityActionsBarProps) {
  return (
    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between bg-slate-50/50 p-4 rounded-xl">
      
      {/* Grupo de Download (PDF + PNG) */}
      <div className="flex flex-wrap gap-2">
        <PrintButton />
        {/* ✅ CORREÇÃO: Passando o objeto 'activity' como o componente espera agora */}
        <InstagramGenerator 
          activity={{
            tema: theme,
            target: age,
            content: content
          }} 
        />
      </div>

      {/* Botão de Compartilhar (Vitrine) */}
      <div className="w-full sm:w-auto">
         <ShareActivity activityContent={content} theme={theme} age={age} />
      </div>

    </div>
  );
}