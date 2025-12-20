"use client";

import Hero from "@/components/Hero";
import { JourneyShortcuts } from "@/components/JourneyShortcuts";
import { PainSection } from "@/components/PainSection";
import { ShelfDisplay } from "@/components/ShelfDisplay";
import { HowItWorksSection } from "@/components/HowItWorksSection";

import { ActivityForm } from "@/components/ActivityForm";

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* 1. SONHO */}
      <Hero />

      {/* 2. ATALHOS */}
      <JourneyShortcuts />

      {/* 2. DOR */}
      <PainSection />

      {/* 3. PROVA REAL */}
      <ShelfDisplay />

      {/* 4. COMO FUNCIONA */}
      <div className="pb-32">
        <HowItWorksSection />
      </div>

      {/* 5. AÇÃO REAL */}
      <section
        id="gerador"
        className="relative mx-auto w-full max-w-6xl px-6 pt-24 pb-32"
      >

        <div className="rounded-[3rem] bg-white/80 p-6 shadow-2xl backdrop-blur-md md:p-12">
          <ActivityForm />
        </div>
      </section>
    </main>
  );
}
