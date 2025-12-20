// src/components/Hero.tsx
"use client";

import { Sparkles, Wand2, BookOpenCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-stone-50">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-6rem] left-[-6rem] h-72 w-72 rounded-full bg-purple-300/40 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-6rem] h-72 w-72 rounded-full bg-pink-300/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-5 py-2 text-sm font-bold text-purple-700 shadow-sm">
          <Sparkles className="h-4 w-4" />
          Pensado para professores da Educação Infantil
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Planejar atividades criativas para sua turma
          <span className="block text-purple-600">
            não precisa ser cansativo
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
          Crie atividades lúdicas e educativas para creches e primeiros anos
          <span className="font-semibold text-slate-800"> em segundos</span>, com a ajuda da inteligência artificial.
        </p>

        {/* Trust line */}
        <p className="mt-8 text-sm font-medium text-slate-500">
          ✨ Gratuito • Sem cadastro • Feito para a realidade da sala de aula
        </p>
      </div>
    </section>
  );
}
