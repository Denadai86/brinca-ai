// src/components/PainSection.tsx

import {
  Clock,
  Frown,
  ClipboardList,
  Sparkles,
} from "lucide-react";

export function PainSection() {
  return (
    <section
      id="isso-e-pra-mim"
      className="relative bg-gradient-to-b from-stone-50 to-purple-50"
    > 
      {/* TÍTULO */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Você ama ensinar.
          <br />
          <span className="text-purple-600">
            O problema não é a sala de aula.
          </span>
        </h2>

        <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
          É tudo o que vem <strong>antes</strong> e <strong>depois</strong> dela.
        </p>
      </div>

      {/* DORES */}
      <div className="grid gap-10 md:grid-cols-2">
        {/* Dor 1 */}
        <div className="glass-panel rounded-[2.5rem] p-10 shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg">
              <Clock size={28} />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-800">
                Falta de tempo de verdade
              </h3>
              <p className="mt-3 text-slate-600 leading-relaxed font-medium">
                Planejar atividades criativas exige horas que você não tem.
                Entre reuniões, registros, casa e vida pessoal, o planejamento
                acaba virando madrugada.
              </p>
            </div>
          </div>
        </div>

        {/* Dor 2 */}
        <div className="glass-panel rounded-[2.5rem] p-10 shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg">
              <ClipboardList size={28} />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-800">
                Planejamento repetitivo
              </h3>
              <p className="mt-3 text-slate-600 leading-relaxed font-medium">
                Você já deu o seu melhor, mas sente que está sempre adaptando as
                mesmas ideias. Falta inspiração nova, adequada à idade e à
                realidade da turma.
              </p>
            </div>
          </div>
        </div>

        {/* Dor 3 */}
        <div className="glass-panel rounded-[2.5rem] p-10 shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg">
              <Frown size={28} />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-800">
                Frustração silenciosa
              </h3>
              <p className="mt-3 text-slate-600 leading-relaxed font-medium">
                A ideia era incrível na sua cabeça… mas na prática a atividade
                não engajou como você imaginou. E ninguém te ensinou a resolver
                isso.
              </p>
            </div>
          </div>
        </div>

        {/* Dor 4 (gancho emocional) */}
        <div className="glass-panel rounded-[2.5rem] p-10 shadow-xl hover:-translate-y-1 transition-all bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg">
              <Sparkles size={28} />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                Você sabe que pode ser mais leve
              </h3>
              <p className="mt-3 text-slate-700 leading-relaxed font-medium">
                No fundo, você sente: ensinar pode ser criativo, lúdico e
                prazeroso. O que falta não é vocação. É apoio, tempo e boas
                ferramentas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
