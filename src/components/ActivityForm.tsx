// src/components/ActivityForm.tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Sparkles,
  Baby,
  School,
  PenTool,
  Loader2,
  Wand2,
  PackageOpen,
} from "lucide-react";

import { generateActivities } from "@/lib/actions";
import { saveActivity } from "@/lib/storage";
import StyledPDF from "./StyledPDF";
import { DonationPix } from "./DonationPix";

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

  useEffect(() => setMounted(true), []);

  async function action(formData: FormData) {
    startTransition(async () => {
      const result = await generateActivities(formData);
      setFormState(result);
    });
  }

  const activities = useMemo(() => {
    if (!formState.data) return [];
    return formState.data
      .split("✨")
      .filter((b) => b.trim().length > 50)
      .slice(0, 2);
  }, [formState.data]);

  useEffect(() => {
    if (formState.success && formState.data && mounted) {
      saveActivity({
        theme: "Atividade Gerada",
        target: tipoIdade === "idade" ? "Por Idade" : "Por Série",
        content: formState.data,
      });
    }
  }, [formState, mounted, tipoIdade]);

  if (!mounted) {
    return (
      <div className="h-[600px] w-full rounded-[3rem] animate-pulse bg-slate-200/40" />
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-24 pb-32">

      {/* FORM */}
      <section
        id="gerador"
        className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-purple-600 to-pink-500 px-6 py-20 md:px-12"
      >
        <div className="relative mx-auto max-w-3xl">
          <header className="mb-14 text-center text-white space-y-4">
            <h2 className="text-3xl md:text-4xl font-black">
              Crie uma atividade
              <span className="block text-pink-200">do seu jeito</span>
            </h2>
            <p className="mx-auto max-w-xl text-white/90">
              Personalize para sua turma e sua realidade.
            </p>
          </header>

          <div className="rounded-[2.5rem] bg-white/95 p-8 md:p-12 shadow-2xl">
            <form action={action} className="space-y-8">
              <input type="hidden" name="tipoIdade" value={tipoIdade} />

              <Field label="Público-alvo" icon={<School size={14} />}>
                <select
                  value={tipoIdade}
                  onChange={(e) => setTipoIdade(e.target.value as any)}
                  className="input"
                >
                  <option value="idade">Por idade</option>
                  <option value="serie">Por série / ciclo</option>
                </select>
              </Field>

              <Field label="Detalhe da turma" icon={<Baby size={14} />}>
                <input
                  name="idade"
                  required
                  placeholder={
                    tipoIdade === "idade"
                      ? "Ex: 4 a 5 anos"
                      : "Ex: Maternal II"
                  }
                  className="input"
                />
              </Field>

              <Field label="Tema" icon={<PenTool size={14} />}>
                <input
                  name="tema"
                  required
                  placeholder="Ex: Cores, animais, emoções..."
                  className="input"
                />
              </Field>

              <Field label="Materiais" icon={<PackageOpen size={14} />}>
                <textarea
                  name="materiais"
                  rows={3}
                  className="input resize-none"
                  placeholder="Ex: papel, cola, sucata..."
                />
              </Field>

              <button
                type="submit"
                disabled={isPending}
                className="mt-6 w-full rounded-[2rem] bg-gradient-to-br from-purple-600 to-pink-500 py-6 text-lg font-black text-white shadow-xl hover:scale-[1.02]"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="animate-spin" />
                    Criando…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Wand2 className="animate-pulse" />
                    Gerar atividade
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* RESULTADOS + DOAÇÃO */}
      {activities.length > 0 && (
        <>
          <div className="grid gap-12">
            {activities.map((item, i) => (
              <article
                key={i}
                className="rounded-[2.5rem] bg-white p-8 md:p-12 shadow-xl"
              >
                <header className="mb-6 flex items-center gap-3">
                  <Sparkles className="text-purple-500" />
                  <h3 className="text-2xl font-black">
                    Opção {i + 1}
                  </h3>
                </header>

                <StyledPDF atividade={item} numero={i + 1} />

                <div className="mt-6 whitespace-pre-wrap text-slate-700">
                  {item}
                </div>
              </article>
            ))}
          </div>

          <DonationPix pixKey="8e1d07bd-5ab5-4968-b5ac-c81d0d3d7d9c" />
        </>
      )}
    </div>
  );
}

/* AUX */
function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
