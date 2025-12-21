//src/components/ActivityForm.tsx
"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { 
  Sparkles, Baby, School, PenTool, 
  Loader2, Wand2, PackageOpen, AlertCircle,
  ClipboardList, Target, Quote, Package, Users
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { generateActivities } from "@/lib/actions";
import { saveActivity } from "@/lib/storage";
import StyledPDF from "./StyledPDF";
import { DonationPix } from "./DonationPix";
import { MagicLoading } from "./MagicLoading";

// --- TIPOS ---
type FormState = {
  success: boolean;
  data?: string;
  error?: string;
};

// --- COMPONENTE PRINCIPAL (O FORMULÁRIO) ---
export function ActivityForm() {
  const [mounted, setMounted] = useState(false);
  const [tipoIdade, setTipoIdade] = useState<"idade" | "serie">("idade");
  const [formState, setFormState] = useState<FormState>({ success: false });
  const [isPending, startTransition] = useTransition();
  
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // 1. Envio do Formulário
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      setFormState({ success: false });
      const result = await generateActivities(formData);
      setFormState(result);
    });
  }

  // 2. Tratamento dos dados retornados (Split por emoji)
  const cleanActivities = useMemo(() => {
    if (!formState.data) return [];
    return formState.data
      .split("✨")
      .map((text) => text.trim())
      .filter((text) => text.length > 50) // Remove lixo
      .slice(0, 2); // Garante 2 atividades
  }, [formState.data]);

  // 3. Efeitos (Salvar e Scroll)
  useEffect(() => {
    if (formState.success && formState.data && mounted) {
      saveActivity({
        theme: "Atividade Gerada",
        target: tipoIdade === "idade" ? "Por Idade" : "Por Série",
        content: formState.data,
      });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [formState, mounted, tipoIdade]);

  if (!mounted) return <div className="h-[400px] w-full rounded-[3rem] bg-slate-100 animate-pulse" />;

  return (
    <div className="w-full space-y-16">
      {/* LOADING MÁGICO */}
      <AnimatePresence>
        {isPending && <MagicLoading />}
      </AnimatePresence>

      {/* ÁREA DE INPUTS (O que estava faltando) */}
      <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-purple-700 to-pink-600 px-6 py-12 shadow-2xl md:px-12 md:py-16">
        {/* Decorativos */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-purple-900/20 blur-2xl" />

        <div className="relative mx-auto max-w-3xl">
          <header className="mb-10 text-center text-white space-y-3">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Crie uma atividade <span className="text-pink-200">do seu jeito</span>
            </h2>
            <p className="mx-auto max-w-lg text-purple-100/90 font-medium text-sm md:text-base">
              Preencha os dados e deixe a IA planejar sua aula.
            </p>
          </header>

          <div className="rounded-[2.5rem] bg-white p-6 shadow-xl md:p-10">
            <form action={handleSubmit} className="space-y-6">
              <input type="hidden" name="tipoIdade" value={tipoIdade} />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Público-alvo" icon={<School size={16} />}>
                  <select
                    value={tipoIdade}
                    onChange={(e) => setTipoIdade(e.target.value as any)}
                    className="input-field"
                  >
                    <option value="idade">Por idade</option>
                    <option value="serie">Por série / ciclo</option>
                  </select>
                </Field>

                <Field label="Detalhe da turma" icon={<Baby size={16} />}>
                  <input
                    name="idade"
                    required
                    placeholder={tipoIdade === "idade" ? "Ex: 4 a 5 anos" : "Ex: Maternal II"}
                    className="input-field"
                  />
                </Field>
              </div>

              <Field label="Tema da Atividade" icon={<PenTool size={16} />}>
                <input name="tema" required placeholder="Ex: Cores, animais, emoções..." className="input-field" />
              </Field>

              <Field label="Materiais (opcional)" icon={<PackageOpen size={16} />}>
                <textarea 
                  name="materiais" 
                  rows={2} 
                  className="input-field resize-none py-3" 
                  placeholder="Ex: papel, cola, sucata..." 
                />
              </Field>

              {formState.error && (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-600 text-sm font-medium">
                  <AlertCircle size={20} />
                  <p>{formState.error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 py-4 text-lg font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 hover:shadow-xl"
              >
                <Wand2 size={20} />
                Gerar Atividade Mágica
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ÁREA DE RESULTADOS */}
      {cleanActivities.length > 0 && (
        <div ref={resultsRef} className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-12 pb-12">
          <div className="space-y-8">
            {cleanActivities.map((atividadeTexto, index) => (
              <ActivityCard 
                key={index} 
                content={atividadeTexto} 
                index={index} 
              />
            ))}
          </div>
          
          <div className="rounded-[2rem] bg-slate-50 border border-slate-100 p-8">
            <DonationPix pixKey="8e1d07bd-5ab5-4968-b5ac-c81d0d3d7d9c" />
          </div>
        </div>
      )}
    </div>
  );
}

// --- HELPERS E CARDS ---

// Parser para extrair tags [TAG]
function parseContent(text: string, tag: string) {
  const regex = new RegExp(`\\[${tag}\\](.*?)(?=\\[|$)`, "s");
  return text.match(regex)?.[1]?.trim() || "";
}

// O Card Inteligente (Que você já tinha, mas agora integrado)
export function ActivityCard({ content, index }: { content: string; index: number }) {
  const titulo = parseContent(content, "TITULO");
  const idade = parseContent(content, "IDADE");
  const materiais = parseContent(content, "MATERIAIS");
  const passos = parseContent(content, "PASSO_A_PASSO");
  const pedagogico = parseContent(content, "PEDAGOGICO");
  const motivacional = parseContent(content, "MOTIVACIONAL");

  return (
    <article className="overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-2xl transition-all hover:shadow-purple-100">
      <header className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-6 border-b border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white font-black shadow-lg">
            {index + 1}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 leading-tight">
              {titulo || "Atividade Mágica"}
            </h3>
            {idade && (
              <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider mt-1">
                <Users size={14} />
                {idade}
              </div>
            )}
          </div>
        </div>
        <StyledPDF atividade={content} numero={index + 1} />
      </header>

      <div className="p-6 md:p-10 space-y-8">
        {motivacional && (
          <div className="relative bg-amber-50 rounded-3xl p-6 border border-amber-100 italic text-amber-900 text-sm leading-relaxed">
            <Quote className="absolute -top-3 -left-2 text-amber-200" size={32} />
            <p className="relative z-10 font-medium">"{motivacional}"</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {materiais && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-pink-600 font-black text-xs uppercase tracking-widest">
                <Package size={16} />
                Materiais
              </div>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-5 rounded-2xl border border-slate-100">
                {materiais}
              </div>
            </section>
          )}

          {pedagogico && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                <Target size={16} />
                Foco Pedagógico
              </div>
              <div className="text-slate-600 text-sm leading-relaxed bg-blue-50/30 p-5 rounded-2xl border border-blue-100">
                {pedagogico}
              </div>
            </section>
          )}
        </div>

        {passos && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-purple-600 font-black text-xs uppercase tracking-widest">
              <ClipboardList size={16} />
              Como Brincar
            </div>
            <div className="prose prose-purple max-w-none text-slate-700 text-base leading-relaxed whitespace-pre-wrap">
              {passos}
            </div>
          </section>
        )}

        <footer className="pt-6 border-t border-slate-100 flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
          <Sparkles size={12} className="text-purple-400" />
          Gerado com inteligência pedagógica • acaoleve.com
        </footer>
      </div>
    </article>
  );
}

// Componente helper de Inputs (Estilização)
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