// ❌ NÃO TEM "use client" aqui. Isso permite que a página carregue super rápido (Server Side).

import Hero from "@/components/Hero";
import { HomeControlPanel } from "@/components/HomeControlPanel"; // O componente interativo
import { ActivityFeed } from "@/components/ActivityFeed"; // A vitrine do servidor

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 overflow-x-hidden">
      
      {/* 1. Hero (Estático e Rápido) */}
      <Hero />
      
      {/* 2. Painel Interativo (Carrega no Cliente) */}
      <HomeControlPanel />

      {/* 3. Vitrine da Comunidade (Carrega no Servidor com SEO) */}
      <div className="max-w-4xl mx-auto mt-12 border-t border-purple-200 pt-12 mb-24 px-4">
         <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
              Vitrine da Comunidade ✨
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Atividades geradas recentemente por outras professoras
            </p>
         </div>
         
         <ActivityFeed />
      </div>

    </main>
  );
}