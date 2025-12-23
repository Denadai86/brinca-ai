import Hero from "@/components/Hero";
import { HomeControlPanel } from "@/components/HomeControlPanel"; 
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 overflow-x-hidden">
      
      {/* 1. Hero (Estático e Rápido) */}
      <Hero />
      
      {/* 2. Painel Interativo (Abas de criação, dores, tutorial) */}
      <HomeControlPanel />

      {/* 3. Chamada para a Vitrine (Leve, sem carregar o banco de dados aqui) */}
      <section className="bg-white border-t border-slate-200 py-16 mt-12 mb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Sem ideias hoje? Explore a Comunidade! 💡
          </h2>
          <p className="text-slate-500 mb-8 text-lg">
            Veja centenas de atividades criadas por outras professoras e inspire-se.
          </p>
          
          <Link 
            href="/vitrine"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-lg"
          >
            Acessar Vitrine Completa <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </main>
  );
}