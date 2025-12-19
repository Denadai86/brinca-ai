// src/components/ActivityForm.tsx

"use client";

import { useState, useMemo, useEffect, useActionState } from "react";
import { 
  Sparkles, Baby, School, PenTool, 
  ClipboardList, Loader2, Wand2, PackageOpen 
} from "lucide-react";
import { generateActivities } from "@/lib/actions"; 
import StyledPDF from "./StyledPDF"; 
import { ShelfDisplay } from "./ShelfDisplay";
import { saveActivity } from "@/lib/storage"; // Já deixando preparado para o Dashboard

export function ActivityForm() {
  const [mounted, setMounted] = useState(false);
  const [tipoIdade, setTipoIdade] = useState<"idade" | "serie">("idade"); 
  
  // 🔥 useActionState (React 19): Gerencia o estado da Action e o carregamento (isPending)
  const [formState, action, isPending] = useActionState(generateActivities, { success: true });
  
  // 1. Garantia de Hidratação (Evita erro de Server vs Client no mobile)
  useEffect(() => { 
    setMounted(true); 
  }, []);

  // 2. 🔥 CORREÇÃO DO REACT COMPILER: Memoização Limpa
  // Separamos o dado para que o compilador não se perca com o operador '?'
  const activities = useMemo(() => {
    const rawData = formState?.data;
    if (!rawData) return [];

    return rawData
      .split("✨")
      .filter((block) => block.trim().length > 50)
      .slice(0, 2);
  }, [formState.data]); // Dependência direta, sem o '?' para satisfazer o compilador

  // 3. 🚀 PREPARAÇÃO PARA O FUTURO: Salvamento Automático no Histórico
  useEffect(() => {
    if (formState?.success && formState?.data && mounted) {
      // Quando a IA responde com sucesso, salvamos no LocalStorage
      try {
        saveActivity({
          theme: "Atividade Gerada", // No futuro podemos pegar o valor do form
          target: tipoIdade === 'idade' ? 'Por Idade' : 'Por Série',
          content: formState.data
        });
      } catch (err) {
        console.error("Erro ao salvar no histórico:", err);
      }
    }
  }, [formState.data, formState.success, mounted, tipoIdade]);

  const inputClasses = "w-full px-5 py-4 rounded-2xl bg-white/40 border border-white/60 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium shadow-sm";

  // Renderização condicional para evitar saltos de layout
  if (!mounted) {
    return <div className="h-[600px] w-full glass-panel rounded-[3rem] animate-pulse" />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-20">
      {/* SEÇÃO DO FORMULÁRIO */}
      <section className="glass-panel rounded-[3rem] p-6 md:p-14 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
            O que vamos <span className="text-purple-600 underline decoration-purple-100 underline-offset-8">brincar</span> hoje?
          </h2>
        </div>

        <form action={action} className="space-y-8">
          <input type="hidden" name="tipoIdade" value={tipoIdade} />
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                <School size={14} className="text-purple-500" /> Público-Alvo
              </label>
              <select 
                value={tipoIdade} 
                onChange={(e) => setTipoIdade(e.target.value as any)} 
                className={inputClasses}
              >
                <option value="idade">Idade das Crianças</option>
                <option value="serie">Série / Ciclo</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                <Baby size={14} className="text-pink-500" /> Detalhe
              </label>
              <input 
                name="idade" 
                placeholder={tipoIdade === 'idade' ? 'Ex: 5 anos' : 'Ex: Maternal I'} 
                className={inputClasses} 
                required 
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
              <PenTool size={14} className="text-blue-500" /> Tema ou Assunto
            </label>
            <input 
              name="tema" 
              placeholder="Ex: Insetos, Estações, Emoções..." 
              className={inputClasses} 
              required 
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
              <PackageOpen size={14} className="text-orange-500" /> Materiais Disponíveis
            </label>
            <textarea 
              name="materiais" 
              rows={3} 
              className={`${inputClasses} resize-none py-4`} 
              placeholder="Ex: Papel sulfite, cola, tampinhas, folhas secas..." 
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="group relative w-full overflow-hidden rounded-[2rem] bg-slate-900 py-6 text-xl font-bold text-white transition-all active:scale-[0.97] shadow-2xl hover:shadow-purple-500/30 disabled:opacity-80"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_auto] group-hover:bg-right transition-all duration-700" />
            <span className="relative flex items-center justify-center gap-3 font-black tracking-tight">
              {isPending ? (
                <><Loader2 className="animate-spin h-6 w-6" /> CRIANDO MÁGICA...</>
              ) : (
                <><Wand2 className="h-6 w-6 animate-pulse" /> GERAR ATIVIDADES</>
              )}
            </span>
          </button>
        </form>
      </section>

      {/* RESULTADOS */}
      {activities.length > 0 && (
        <div className="grid gap-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-black text-slate-300 uppercase tracking-[0.4em]">Opções Prontas</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {activities.map((item, i) => (
            <article 
              key={i} 
              className="glass-panel rounded-[2.5rem] p-8 md:p-12 shadow-xl hover:translate-y-[-4px] transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/50 pb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-500 text-white p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Opção {i + 1}</h3>
                    <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mt-1">Sugerida por IA</p>
                  </div>
                </div>
                <StyledPDF atividade={item} numero={i + 1} />
              </div>
              <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {item.trim()}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* PRATELEIRA PADRÃO */}
      {!isPending && activities.length === 0 && (
        <div className="pt-10 border-t border-slate-100">
          <ShelfDisplay />
        </div>
      )}
    </div>
  );
}