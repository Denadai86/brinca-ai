// src/app/page.tsx
//teste sinc
import { ActivityForm } from "@/components/ActivityForm";

export default function Home() {
  return (
    <section className="flex flex-col items-center">
      <header className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-purple-100 shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">IA Generativa para Professores</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
          Brinca<span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-500">AI</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          Transforme seu plano de aula em segundos. Atividades lúdicas personalizadas que encantam as crianças.
        </p>
      </header>

      <div className="w-full animate-in fade-in slide-in-from-bottom-8 delay-300 duration-1000 fill-mode-both">
        <ActivityForm />
      </div>
    </section>
  );
}