// src/components/ShelfDisplay.tsx

import { Sparkles, BookOpen } from "lucide-react";
import ShelfData from "../data/prateleira.json";

import StyledPDF from "./StyledPDF";
import { VideoDemonstracao } from "./VideoDemonstracao";

// Extrai apenas a primeira atividade para preview
const parseActivities = (raw: string) =>
  raw
    .split("✨")
    .filter((block) => block.trim().length > 50)
    .slice(0, 1);

export function ShelfDisplay() {
  const activityData = ShelfData.map((item) => ({
    ...item,
    parsedActivities: parseActivities(`✨ ${item.atividade.trim()}`),
  }));

  return (
    <section
      id="exemplos"
      className="scroll-mt-32 py-24 px-6 bg-gradient-to-b from-purple-50 via-white to-white"
    >
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-5 py-2 text-xs font-black uppercase tracking-widest text-purple-700">
            <Sparkles size={14} />
            Exemplos reais
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Ideias prontas para usar
            <br />
            <span className="text-purple-600">
              com crianças de verdade
            </span>
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Veja atividades que já funcionam na prática e use como inspiração
            para criar as suas em segundos.
          </p>
        </div>

        {/* Vídeo demonstrativo */}
        <div className="mb-20 flex justify-center">
          <VideoDemonstracao />
        </div>

        {/* Prateleira */}
        <div className="grid gap-12">
          {activityData.map((item) => (
            <article
              key={item.id}
              className="group relative rounded-[2.5rem] bg-white/80 backdrop-blur-md border border-purple-100 p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all"
            >
              {/* Tema */}
              <header className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <BookOpen size={22} />
                </div>

                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {item.tema}
                </h3>
              </header>

              {/* Atividade resumida */}
              {item.parsedActivities.map((atividade, index) => (
                <div key={index} className="space-y-6">
                  <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap line-clamp-4">
                    ✨ {atividade.trim()}
                  </p>

                  <div className="flex justify-end">
                    <StyledPDF
                      atividade={`✨ ${atividade.trim()}`}
                      numero={item.id}
                    />
                  </div>
                </div>
              ))}
            </article>
          ))}
        </div>

        {/* Micro CTA pós exemplos */}
        <div className="mt-24 text-center">
          <p className="text-xl font-bold text-slate-700 mb-6">
            Agora imagine isso feito sob medida para a sua turma 💜
          </p>

          <a
            href="#gerador"
            className="inline-flex items-center gap-3 rounded-[2rem] bg-purple-600 px-10 py-5 text-lg font-black text-white shadow-xl hover:scale-[1.03] transition-all"
          >
            <Sparkles />
            Criar minha atividade
          </a>
        </div>
      </div>
    </section>
  );
}
