// src/components/HowItWorksSection.tsx

import {
  PenLine,
  Wand2,
  Smile,
} from "lucide-react";

export function HowItWorksSection() {
  return (
    <section 
      id="como-funciona"
      className="relative bg-gradient-to-b from-purple-50 to-indigo-50"
      >
      <div className="max-w-6xl mx-auto">
        {/* TÍTULO */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Planejar pode ser
            <span className="text-purple-600"> leve</span>,
            <br />
            rápido e até divertido
          </h2>

          <p className="mt-6 text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            O BrincaAI transforma suas ideias em atividades lúdicas prontas,
            pensadas para a idade da criança e para a realidade da sala de aula.
          </p>
        </div>

        {/* PASSOS */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* Passo 1 */}
          <div className="relative glass-panel rounded-[3rem] p-10 shadow-xl hover:-translate-y-2 transition-all">
            <div className="absolute -top-6 left-10 text-sm font-black bg-purple-600 text-white px-4 py-1 rounded-full shadow-lg">
              Passo 1
            </div>

            <div className="flex flex-col gap-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white w-fit shadow-lg">
                <PenLine size={28} />
              </div>

              <h3 className="text-2xl font-black text-slate-800">
                Conte o básico
              </h3>

              <p className="text-slate-600 leading-relaxed font-medium">
                Informe a idade ou série, o tema da aula e os materiais que você
                tem disponível. Nada de formulários longos ou complicados.
              </p>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="relative glass-panel rounded-[3rem] p-10 shadow-xl hover:-translate-y-2 transition-all">
            <div className="absolute -top-6 left-10 text-sm font-black bg-pink-500 text-white px-4 py-1 rounded-full shadow-lg">
              Passo 2
            </div>

            <div className="flex flex-col gap-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white w-fit shadow-lg">
                <Wand2 size={28} />
              </div>

              <h3 className="text-2xl font-black text-slate-800">
                A IA cria por você
              </h3>

              <p className="text-slate-600 leading-relaxed font-medium">
                Em segundos, o BrincaAI gera atividades criativas, alinhadas ao
                desenvolvimento infantil e fáceis de aplicar na prática.
              </p>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="relative glass-panel rounded-[3rem] p-10 shadow-xl hover:-translate-y-2 transition-all">
            <div className="absolute -top-6 left-10 text-sm font-black bg-orange-500 text-white px-4 py-1 rounded-full shadow-lg">
              Passo 3
            </div>

            <div className="flex flex-col gap-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white w-fit shadow-lg">
                <Smile size={28} />
              </div>

              <h3 className="text-2xl font-black text-slate-800">
                Aplique com confiança
              </h3>

              <p className="text-slate-600 leading-relaxed font-medium">
                Use a atividade do seu jeito, adapte se quiser e aproveite o que
                realmente importa: o momento com as crianças.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
