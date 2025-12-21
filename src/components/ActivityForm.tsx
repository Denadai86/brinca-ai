"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Sparkles,
  Baby,
  School,
  PenTool,
  Loader2,
  Wand2,
  PackageOpen,
  AlertCircle,
} from "lucide-react";

import { generateActivities } from "@/lib/actions"; // Supondo que exista
import { saveActivity } from "@/lib/storage";       // Supondo que exista
import StyledPDF from "./StyledPDF";
import { DonationPix } from "./DonationPix";
// import { ShareActivity } from "./ShareActivity"; // Se for usar, descomente

type FormState = {
  success: boolean;
  data?: string;
  error?: string;
};

export function ActivityForm() {
  const [mounted, setMounted] = useState(false);
  const [tipoIdade, setTipoIdade] = useState<"idade" | "serie">("idade");
  const [formState, setFormState] = useState<FormState>({ success: false });
  const [isPending, startTransition] = useTransition();
  
  // Ref para scroll automático até os resultados
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // 1. Processamento da Server Action
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      // Limpa estados anteriores se necessário
      setFormState({ success: false });
      
      const result = await generateActivities(formData);
      setFormState(result);
    });
  }

  // 2. Lógica de tratamento de dados (Onde você se perdeu no .map)
  // Aqui transformamos a string bruta em um array limpo PRONTO para o render.
  const cleanActivities = useMemo(() => {
    if (!formState.data) return [];

    return formState.data
      .split("✨") // Divide onde tem o emoji
      .map((text) => text.trim()) // Remove espaços extras
      .filter((text) => text.length > 50) // Remove pedaços muito curtos/inválidos
      .slice(0, 2); // Garante que pegamos apenas as 2 melhores opções
  }, [formState.data]);

  // 3. Efeitos colaterais (Salvar e Scroll)
  useEffect(() => {
    if (formState.success && formState.data && mounted) {
      // Salva no histórico local
      saveActivity({
        theme: "Atividade Gerada",
        target: tipoIdade === "idade" ? "Por Idade" : "Por Série",
        content: formState.data,
      });

      // Scroll suave até os resultados
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [formState, mounted, tipoIdade]);

  // Skeleton loading simples para evitar Hydration Error
  if (!mounted) {
    return (
      <div className="mx-auto h-[400px] w-full max-w-4xl rounded-[3rem] bg-slate-100 animate-pulse" />
    );
  }

  return (
    <div className="w-full space-y-16">
      
      {/* --- BLOCO DO FORMULÁRIO --- */}
      <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-purple-700 to-pink-600 px-6 py-16 shadow-2xl md:px-12 md:py-20">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-purple-900/20 blur-2xl" />

        <div className="relative mx-auto max-w-3xl">
          <header className="mb-12 text-center text-white space-y-3">
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">
              Crie uma atividade <br />
              <span className="text-pink-200">do seu jeito</span>
            </h2>
            <p className="mx-auto max-w-lg text-lg text-purple-100/90 font-medium">
              Preencha os dados abaixo e deixe a IA planejar sua aula em segundos.
            </p>
          </header>

          <div className="rounded-[2.5rem] bg-white p-8 shadow-xl md:p-10">
            <form action={handleSubmit} className="space-y-6">
              <input type="hidden" name="tipoIdade" value={tipoIdade} />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Público-alvo" icon={<School size={16} />}>
                  <select
                    value={tipoIdade}
                    onChange={(e) => setTipoIdade(e.target.value as "idade" | "serie")}
                    className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 px-4 text-slate-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  >
                    <option value="idade">Por idade</option>
                    <option value="serie">Por série / ciclo</option>
                  </select>
                </Field>

                <Field label="Detalhe da turma" icon={<Baby size={16} />}>
                  <input
                    name="idade"
                    required
                    placeholder={
                      tipoIdade === "idade" ? "Ex: 4 a 5 anos" : "Ex: Maternal II"
                    }
                    className="input-field"
                  />
                </Field>
              </div>

              <Field label="Tema da Atividade" icon={<PenTool size={16} />}>
                <input
                  name="tema"
                  required
                  placeholder="Ex: Cores, animais, dia da água..."
                  className="input-field"
                />
              </Field>

              <Field label="Materiais disponíveis" icon={<PackageOpen size={16} />}>
                <textarea
                  name="materiais"
                  rows={2}
                  className="input-field resize-none py-3"
                  placeholder="Ex: papel, cola, sucata (opcional)..."
                />
              </Field>

              {/* Exibição de Erro se houver */}
              {formState.error && (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-600 text-sm font-medium">
                  <AlertCircle size={20} />
                  <p>{formState.error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="group mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 py-5 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Criando mágica...
                  </>
                ) : (
                  <>
                    <Wand2 className="group-hover:animate-pulse" />
                    Gerar Atividade
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- BLOCO DE RESULTADOS --- */}
      {/* Renderização Condicional: Só mostra se tiver atividades processadas */}
      {cleanActivities.length > 0 && (
        <div ref={resultsRef} className="animate-in fade-in slide-in-from-bottom-10 duration-700 mx-auto max-w-4xl space-y-12 pb-12">
          
          <div className="flex items-center justify-center gap-2 text-purple-600">
            <Sparkles className="fill-purple-200" />
            <span className="text-sm font-bold uppercase tracking-widest">Resultados Prontos</span>
          </div>

          <div className="space-y-8">
            {/* AQUI ESTÁ O .MAP QUE VOCÊ SE PERDEU */}
            {cleanActivities.map((atividadeTexto, index) => (
              <ActivityCard 
                key={index} 
                content={atividadeTexto} 
                index={index} 
              />
            ))}
          </div>

          {/* Área de Doação / Monetização */}
          <div className="rounded-[2rem] bg-slate-50 border border-slate-100 p-8">
            <DonationPix pixKey="8e1d07bd-5ab5-4968-b5ac-c81d0d3d7d9c" />
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTES PARA LIMPEZA ---

// Componente para renderizar cada card de resultado
function ActivityCard({ content, index }: { content: string; index: number }) {
  return (
    <article className="overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold">
            {index + 1}
          </div>
          <h3 className="text-xl font-bold text-slate-800">Opção de Atividade</h3>
        </div>
        {/* Componente de PDF injetado aqui */}
        <StyledPDF atividade={content} numero={index + 1} />
      </div>

      <div className="p-8 md:p-10">
        <div className="prose prose-purple max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>
    </article>
  );
}

// Componente helper para inputs
function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}