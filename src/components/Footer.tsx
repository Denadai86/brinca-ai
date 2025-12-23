import Link from "next/link";
import { Instagram, Rocket } from "lucide-react";

export function Footer() {
  const instagramUrl = "https://instagram.com/brinca_ai_saas";

  return (
    // Mantendo seu estilo original: Leve, transparente e com blur
    <footer className="border-t border-slate-200/60 bg-white/40 backdrop-blur-md py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* 1. Logo e Copyright (Seu texto original) */}
        <div className="text-center md:text-left space-y-3 max-w-xs">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-800 font-bold text-xl">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <Rocket size={20} />
            </div>
            Brinca-AI
          </div>
          
          <p className="text-slate-500 font-medium text-sm">
             Brinca-AI © {new Date().getFullYear()} –{" "}
             <span className="font-bold text-slate-900">acaoleve.com</span>
          </p>
        </div>

        {/* 2. Links Úteis (Seus links integrados verticalmente para mobile/desktop) */}
        <div className="text-center md:text-left space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Navegação</h4>
          <div className="flex flex-col gap-2">
            <Link href="/vitrine" className="text-sm text-slate-500 hover:text-purple-600 font-medium transition-colors">
              Vitrine da Comunidade
            </Link>
            
            {/* Seus links de política */}
            <Link 
              href="/termos-de-uso" 
              className="text-xs font-bold text-slate-400 hover:text-purple-600 uppercase tracking-widest transition-colors"
            >
              Termos de Uso
            </Link>
            <Link 
              href="/politica-de-privacidade" 
              className="text-xs font-bold text-slate-400 hover:text-purple-600 uppercase tracking-widest transition-colors"
            >
              Privacidade
            </Link>
          </div>
        </div>

        {/* 3. Área do Instagram + QR Code (Visual limpo para combinar com o tema claro) */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <a 
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-600 font-bold hover:text-pink-600 transition-colors"
          >
            <Instagram size={20} />
            Siga @brinca_ai
          </a>

          {/* Card do QR Code (Fundo branco para destacar no glassmorphism) */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 transform hover:scale-105 transition-transform duration-300">
            <p className="text-slate-400 text-[10px] font-bold text-center mb-2 uppercase tracking-wide">
              Escaneie para seguir
            </p>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${instagramUrl}&color=4c1d95`}
              alt="QR Code Instagram"
              width={100}
              height={100}
              className="rounded-lg opacity-90"
            />
          </div>
        </div>

      </div>
    </footer>
  );
}