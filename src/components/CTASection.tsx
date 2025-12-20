// src/components/CTASection.tsx

import { Wand2, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 py-24 px-6">


      <div className="relative max-w-4xl mx-auto text-center text-white">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm font-black uppercase tracking-widest backdrop-blur-md mb-8">
          <Sparkles size={16} />
          Comece agora
        </div>



        <p className="mt-6 text-lg md:text-xl font-medium text-white/90 max-w-2xl mx-auto leading-relaxed">
          Sem cadastro. Sem complicação.  
          Pensado para a realidade da educação infantil brasileira.
        </p>

        <a
          href="#gerador"
          className="mt-10 inline-flex items-center justify-center gap-3 rounded-[2rem] bg-white px-10 py-5 text-lg font-black text-purple-700 shadow-2xl hover:scale-[1.03] transition-all"
        >
          <Wand2 />
          Quero gerar minha atividade
        </a>
      </div>
    </section>
  );
}
