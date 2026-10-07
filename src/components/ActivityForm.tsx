"use client";
//src/components/ActivityForm.tsx
import { useState, useTransition } from "react";
import {
  Wand2,
  School,
  Baby,
  PenTool,
  Sparkles,
  PackageOpen,
  AlertCircle,
} from "lucide-react";

import { generateActivities } from "@/lib/actions";
import { useAuth } from "@/auth/AuthProvider";
import type { GeneratedActivity } from "@/lib/activity-format";
import { GeneratedActivityCard } from "./GeneratedActivityCard";

interface Result {
  activities: GeneratedActivity[];
  tema: string;
  target: string;
}

export function ActivityForm() {
  const { user } = useAuth();
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-12">
      {/* ================= FORMULÁRIO ================= */}
      <form
        action={(fd) =>
          startTransition(async () => {
            setError(null);

            try {
              // Logado: manda o ID token para o servidor contar a cota por usuário.
              // Anônimo: segue sem token (cota por IP).
              if (user) fd.set("idToken", await user.getIdToken());

              const res = await generateActivities(fd);

              if (res.success && res.activities?.length) {
                setResult({
                  activities: res.activities,
                  tema: res.tema ?? "",
                  target: res.target ?? "",
                });
              } else {
                // Antes: erro (limite, IA fora do ar) não aparecia — o botão só "voltava".
                setError(res.error ?? "Hmm, não consegui criar agora. Tente de novo daqui a pouquinho.");
              }
            } catch (err) {
              console.error("Falha ao gerar atividades:", err);
              setError("Parece que a internet deu uma sumida. Confira a conexão e tente de novo, tá?");
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
            <label
              htmlFor="tipoIdade"
              className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 ml-1"
            >
              <School size={14} /> Público
            </label>

            <select
              id="tipoIdade"
              name="tipoIdade"
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-purple-200 font-medium text-slate-700"
            >
              <option value="idade">Por Idade</option>
              <option value="serie">Por Série Escolar</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="idade"
              className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 ml-1"
            >
              <Baby size={14} /> Detalhe da Turma
            </label>

            <input
              id="idade"
              name="idade"
              required
              maxLength={60}
              placeholder="Ex: 4 anos ou Maternal II"
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-200 font-medium placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Tema */}
        <div className="space-y-2">
          <label
            htmlFor="tema"
            className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 ml-1"
          >
            <PenTool size={14} /> Tema da Aula
          </label>

          <input
            id="tema"
            name="tema"
            required
            maxLength={120}
            placeholder="Ex: Coordenação Motora, Dia da Água..."
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-200 font-medium placeholder:text-slate-300"
          />
        </div>

        {/* Materiais */}
        <div className="space-y-2">
          <label
            htmlFor="materiais"
            className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 ml-1"
          >
            <PackageOpen size={14} /> Materiais Disponíveis (Opcional)
          </label>

          <textarea
            id="materiais"
            name="materiais"
            rows={3}
            maxLength={300}
            placeholder="Ex: Tenho bambolês, tinta guache e papelão..."
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-200 font-medium placeholder:text-slate-300 resize-none"
          />
        </div>

        {/* Erro (limite, IA indisponível, rede) */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

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
      {result && (
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
          <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs">
            <Sparkles size={14} className="text-purple-500" />
            Resultados Prontos
          </div>

          {result.activities.map((activity, index) => (
            <GeneratedActivityCard
              key={`${activity.titulo}-${index}`}
              activity={activity}
              tema={result.tema}
              target={result.target}
              index={index}
            />
          ))}
        </section>
      )}
    </div>
  );
}