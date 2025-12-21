//src/app/page.tsx

"use client";

import Hero from "@/components/Hero";
import { JourneyShortcuts } from "@/components/JourneyShortcuts";
import { PainSection } from "@/components/PainSection";
import { ShelfDisplay } from "@/components/ShelfDisplay";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ActivityForm } from "@/components/ActivityForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 overflow-x-hidden">
      
      {/* 1. TOPO DO FUNIL (Sonho e Promessa) */}
      <Hero />

      {/* 2. CONSCIÊNCIA (Atalhos e Dores) */}
      <JourneyShortcuts />
      <PainSection />

      {/* 3. PROVA SOCIAL / EXEMPLOS */}
      <ShelfDisplay />

      {/* 4. MECÂNICA (Como funciona) */}
      <div className="bg-white pb-24 pt-12">
        <HowItWorksSection />
      </div>

      {/* 5. AÇÃO (Ferramenta Real) */}
      <section
        id="gerador"
        className="relative mx-auto w-full max-w-6xl px-4 md:px-6 pb-32"
      >
        <div className="text-center mb-10">
          <span className="rounded-full bg-purple-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-700">
            Sua vez de testar
          </span>
        </div>

        {/* O formulário agora é autocontido e estiloso */}
        <ActivityForm />
        
      </section>

      {/* Footer ficaria aqui abaixo */}
    </main>
  );
}