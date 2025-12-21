//src/app/page.tsx
"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import { JourneyShortcuts, SectionType } from "@/components/JourneyShortcuts";
import { PainSection } from "@/components/PainSection";
import { ShelfDisplay } from "@/components/ShelfDisplay";
import { HowItWorksSection } from "@/components/HowItWorksSection";
// CORREÇÃO: Importamos o FORMULÁRIO, não o Card isolado
import { ActivityForm } from "@/components/ActivityForm";
import { Wand2 } from "lucide-react";

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionType>("generator");

  const handleSectionChange = (section: SectionType) => {
    setActiveSection(section);
    setTimeout(() => {
      const el = document.getElementById("anchor-point");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <main className="flex min-h-screen flex-col bg-slate-50/50">
      <Hero />

      {/* NAVEGAÇÃO STICKY */}
      <section className="sticky top-[64px] md:top-[80px] z-40 bg-white/80 backdrop-blur-md py-4 px-4 border-b border-slate-200">
        <div className="mx-auto max-w-5xl">
          <JourneyShortcuts 
            activeSection={activeSection} 
            onSelect={handleSectionChange} 
          />
        </div>
      </section>

      <div id="anchor-point" className="scroll-mt-[180px] md:scroll-mt-[220px]" />

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6 pb-20 pt-4">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {activeSection === "pain" && (
            <div className="rounded-[2rem] md:rounded-[3rem] bg-white p-6 md:p-16 shadow-xl border border-blue-100">
              <PainSection />
            </div>
          )}

          {activeSection === "shelf" && (
            <div className="rounded-[2rem] md:rounded-[3rem] bg-white p-4 md:p-16 shadow-xl border border-pink-100">
              <ShelfDisplay />
            </div>
          )}

          {activeSection === "how" && (
            <div className="rounded-[2rem] md:rounded-[3rem] bg-white p-6 md:p-16 shadow-xl border border-amber-100">
              <HowItWorksSection />
            </div>
          )}

          {/* CORREÇÃO: Renderiza o Formulário completo */}
          {activeSection === "generator" && (
            <ActivityForm />
          )}
        </div>

        {/* CTA DE RETORNO AO GERADOR */}
        {activeSection !== "generator" && (
          <div className="mt-12 flex justify-center px-4">
            <button 
              onClick={() => handleSectionChange("generator")}
              className="group flex w-full md:w-auto items-center justify-center gap-4 rounded-2xl bg-slate-900 px-8 py-5 text-white shadow-2xl transition-all active:scale-95"
            >
              <div className="text-left leading-tight">
                <span className="block text-[10px] uppercase font-bold opacity-60 tracking-widest">Gostou?</span>
                <span className="text-base md:text-lg font-black">Experimentar o Gerador Agora</span>
              </div>
              <Wand2 size={24} className="text-purple-400 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        )}
      </section>

      <footer className="py-12 text-center text-slate-400 text-[10px] uppercase tracking-widest font-bold border-t border-slate-100">
        acaoleve.com • Brinca-AI
      </footer>
    </main>
  );
}