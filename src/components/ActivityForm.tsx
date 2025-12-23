"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Wand2,
  School,
  Baby,
  PenTool,
  Sparkles,
  PackageOpen,
} from "lucide-react";

import { generateActivities } from "@/lib/actions";
import { GeneratedActivityCard } from "./GeneratedActivityCard";

interface FormState {
  success: boolean;
  data: string;
}

export function ActivityForm() {
  const [formState, setFormState] = useState<FormState>({
    success: false,
    data: "",
  });

  const [isPending, startTransition] = useTransition();

  /**
   * 🔹 Extrai atividades individuais da resposta da IA
   * Cada atividade vem separada por "✨"
   */
  const activities = useMemo<string[]>(() => {
    if (!formState.data) return [];

    return formState.data
      .split("✨")
      .map(t => t.trim())
      .filter(t => t.length > 50);
  }, [formState.data]);

  return (
    <div className="space-y-12">
      {/* ================= FORMULÁRIO ================= */}
      <form
        action={fd =>
          startTransition(async () => {
            const res = await generateActivities(fd);

            if (res?.success && res.data) {
              setFormState({
                success: true,
                data: res.data,
              });
            }
          })
        }
        className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-2 mb-4">
          <h3 className="text-2xl font-black text-slate-800">
            Crie Atividades Únicas
          </h3>
          <p className="text-slate-400 text-sm">
            Personalize cada detalhe para sua turma
          </p>
        </div>

        {/* Público */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 ml-1">
              <School size={14} /> Público
            </label>

            <select
              name="tipoIdade"
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-purple-200 font-medium text-slate-700"
            >
              <option value="idade">Por Idade</option>
              <option value="serie">Por Série Escolar</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 ml-1">
              <Baby size={14} /> Detalhe da Turma
            </label>

            <input
              name="idade"
              required
              placeholder="Ex: 4 anos ou Maternal II"
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-200 font-medium placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Tema */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 ml-1">
            <PenTool size={14} /> Tema da Aula
          </label>

          <input
            name="tema"
            required
            placeholder="Ex: Coordenação Motora, Dia da Água..."
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-200 font-medium placeholder:text-slate-300"
          />
        </div>

        {/* Materiais */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 ml-1">
            <PackageOpen size={14} /> Materiais Disponíveis (Opcional)
          </label>

          <textarea
            name="materiais"
            rows={3}
            placeholder="Ex: Tenho bambolês, tinta guache e papelão..."
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-200 font-medium placeholder:text-slate-300 resize-none"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-black text-lg shadow-xl transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isPending ? (
            <span className="animate-pulse">Criando mágica…</span>
          ) : (
            <>
              <Wand2 size={20} />
              GERAR ATIVIDADE
            </>
          )}
        </button>
      </form>

      {/* ================= RESULTADOS ================= */}
      {activities.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
          <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs">
            <Sparkles size={14} className="text-purple-500" />
            Resultados Prontos
          </div>

          {activities.map((content, index) => (
            <GeneratedActivityCard
              key={index}
              content={content}
              index={index}
            />
          ))}
        </section>
      )}
    </div>
  );
}
