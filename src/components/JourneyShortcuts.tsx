"use client";

import {
  BookOpenCheck,
  HeartHandshake,
  Puzzle,
  Wand2,
} from "lucide-react";

export function JourneyShortcuts() {
  return (
    <section className="relative bg-gradient-to-b from-indigo-50 via-purple-50 to-purple-100">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          Como o <span className="text-purple-600">Brinca-AI</span> pode te ajudar hoje?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Escolha por onde começar. Sem pressa, sem cobrança. 💜
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* DOR */}
        <a
          href="#isso-e-pra-mim"
          className="group rounded-3xl border border-stone-200 bg-stone-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-600 text-white shadow-md">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-black text-slate-800">
            Isso é pra mim?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Se planejar anda cansativo, você não está sozinha.
          </p>
        </a>
        
        {/* EXEMPLOS */}
        <a
          href="#exemplos"
          className="group rounded-3xl border border-purple-200 bg-purple-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
            <BookOpenCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-black text-purple-700">
            Ver exemplos prontos
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Atividades reais, pensadas para a rotina da sala de aula.
          </p>
        </a>



        {/* COMO FUNCIONA */}
        <a
          href="#como-funciona"
          className="group rounded-3xl border border-blue-200 bg-blue-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
            <Puzzle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-black text-blue-700">
            Como funciona
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Do tema à atividade pronta em poucos passos simples.
          </p>
        </a>

        {/* AÇÃO */}
        <a
          href="#gerador"
          className="group rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 p-6 text-white transition-all hover:-translate-y-1 hover:shadow-purple-500/40"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-md backdrop-blur">
            <Wand2 className="h-6 w-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-black">
            Criar atividade agora
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/90">
            Personalize uma atividade para sua turma em segundos.
          </p>
        </a>
      </div>
    </section>
  );
}
