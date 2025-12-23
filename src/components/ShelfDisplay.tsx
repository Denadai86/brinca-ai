"use client";

import { useEffect, useState, useTransition } from "react";
import { getPublicActivities } from "@/lib/actions";
// IMPORTAÇÃO CORRETA AGORA:
import { ActivityCard } from "./ActivityCard";
import { LayoutGrid, Loader2, Sparkles } from "lucide-react";

export function ShelfDisplay() {
  const [activities, setActivities] = useState<any[]>([]);
  const [filter, setFilter] = useState("todos");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getPublicActivities(filter);
      if (res.success && res.data) {
        setActivities(res.data);
      }
    });
  }, [filter]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-4 border-b border-slate-100">
        <div className="space-y-2">
           <div className="inline-flex items-center gap-2 text-pink-500 font-black uppercase tracking-widest text-[10px] bg-pink-50 px-3 py-1 rounded-full">
             <LayoutGrid size={12}/> Comunidade
           </div>
           <h2 className="text-3xl font-black text-slate-800">Galeria de Inspiração</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {["todos", "maternal", "pre"].map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)} 
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase transition-all ${
                filter === cat 
                  ? 'bg-slate-900 text-white shadow-lg scale-105' 
                  : 'bg-white border border-slate-200 text-slate-400 hover:border-purple-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isPending ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-purple-600" size={48}/>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Carregando acervo...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
           <p className="text-slate-400 font-medium">Nenhuma atividade encontrada nesta categoria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
          {activities.map((act, i) => (
            <ActivityCard key={act.id || i} content={act.content} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}