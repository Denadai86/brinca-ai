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
        <InstagramGenerator content={content} theme={theme} age={age} />
      </div>

      {/* Botão de Compartilhar (Vitrine) */}
      <div className="w-full sm:w-auto">
         {/* Nota: O ShareActivity original tem um botão grande "width-full". 
             Talvez você queira ajustar o CSS dele depois, mas aqui ele funciona. */}
         <ShareActivity activityContent={content} theme={theme} age={age} />
      </div>

    </div>
  );
}