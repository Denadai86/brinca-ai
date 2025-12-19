import "./globals.css";
import { GtmScript, GtmNoScript } from '@/components/telemetry/GtmScript'; 
import { AnimatedHeader } from "@/components/AnimatedHeader";
import { Metadata, Viewport } from 'next';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || null;

// Configurações de Viewport para Mobile
export const viewport: Viewport = {
  themeColor: '#8b5cf6', // Roxo principal
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Brinca-AI – Atividades mágicas com IA",
  description: "Transforme sua sala de aula com atividades lúdicas geradas por inteligência artificial.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full scroll-smooth">
      <head>
        <GtmScript gtmId={GTM_ID} />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 relative overflow-x-hidden font-sans selection:bg-purple-200">
        <GtmNoScript gtmId={GTM_ID} />
        
        {/* DESIGN DE FUNDO DINÂMICO E VIVO */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-noise">
          {/* Camada de Ruído (Noise) */}
          <div className="absolute inset-0 bg-noise mix-blend-soft-light" />
          
          {/* Blobs Animados com Cores Vibrantes e Blur Profundo */}
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob" />
          <div className="absolute top-[-5%] right-[-5%] w-[450px] h-[450px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-pink-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob" />
        </div>

        {/* Header fixo com efeito Glassmorphism se necessário */}
        <AnimatedHeader />

        <main className="relative pt-16 pb-24 px-4 max-w-5xl mx-auto">
          {children}
        </main>

        {/* Rodapé Estruturado */}
        <footer className="border-t border-slate-200/60 bg-white/40 backdrop-blur-md py-12 relative">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="flex justify-center gap-8 mb-6">
              <a href="/termos-de-uso" className="text-xs font-bold text-slate-400 hover:text-purple-600 transition-colors uppercase tracking-widest">Termos</a>
              <a href="/politica-de-privacidade" className="text-xs font-bold text-slate-400 hover:text-purple-600 transition-colors uppercase tracking-widest">Privacidade</a>
            </div>
            <p className="text-slate-500 font-medium">
              Brinca-AI &copy; {new Date().getFullYear()} – Uma marca <span className="text-slate-900 font-bold">acaoleve.com</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}