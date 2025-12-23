"use client"; // Este arquivo cuida da interatividade (cliques, abas)

import { useState } from "react";
import { JourneyShortcuts, SectionType } from "@/components/JourneyShortcuts";
import { ShelfDisplay } from "@/components/ShelfDisplay";
import { ActivityForm } from "@/components/ActivityForm";
import { PainSection } from "@/components/PainSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";

export function HomeControlPanel() {
  const [activeSection, setActiveSection] = useState<SectionType>("generator");

  return (
    <>
      {/* Navegação Sticky */}
      <section className="sticky top-[70px] z-40 bg-white/80 backdrop-blur-md py-4 border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <JourneyShortcuts 
            activeSection={activeSection} 
            onSelect={(section) => {
              setActiveSection(section);
              setTimeout(() => {
                document.getElementById("anchor-point")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }} 
          />
        </div>
      </section>

      <div id="anchor-point" className="scroll-mt-32" />

      {/* Conteúdo que muda conforme o clique */}
      <section className="max-w-6xl mx-auto w-full px-4 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeSection === "pain" && <PainSection />}
          {activeSection === "how" && <HowItWorksSection />}
          {activeSection === "shelf" && <ShelfDisplay />}
          {activeSection === "generator" && <ActivityForm />}
        </div>
      </section>
    </>
  );
}