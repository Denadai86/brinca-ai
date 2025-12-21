"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { SupporterBadge } from "@/components/SupporterBadge";
import { useAuth } from "@/auth/AuthProvider";
import { LogIn, LogOut, User } from "lucide-react";
import { Modal } from "@/components/ui/Modal"; // 1. Importe o Modal
import { LoginModalContent } from "@/auth/LoginModalContent"; // 2. Importe o Conteúdo

const SCROLL_THRESHOLD = 50;

const logoSize = {
  default: "w-12 h-12 md:w-16 md:h-16",
  scrolled: "w-10 h-10 md:w-12 md:h-12",
};

const headerPadding = {
  default: "py-4",
  scrolled: "py-2",
};

export function AnimatedHeader() {
  const { user, login, logout, loading } = useAuth();
  
  // 3. Estado local para controlar a visibilidade do modal
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    if (currentScrollPos > SCROLL_THRESHOLD && !isScrolled) setIsScrolled(true);
    else if (currentScrollPos <= SCROLL_THRESHOLD && isScrolled) setIsScrolled(false);
  }, [isScrolled]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Função intermediária: Fecha o modal após login (opcional, depende do seu fluxo)
  const handleLoginTrigger = async () => {
     await login();
     setIsLoginOpen(false);
  }

  const headerClasses = `
    bg-white/90 backdrop-blur-md shadow-lg border-b border-purple-200 sticky top-0 z-50
    transition-all duration-300 ease-in-out
    ${isScrolled ? headerPadding.scrolled : headerPadding.default}
  `;

  const logoContainerClasses = `
    rounded-full overflow-hidden border-4 border-purple-400 shadow-lg transition-all duration-300 ease-in-out
    ${isScrolled ? logoSize.scrolled : logoSize.default}
  `;

  const titleClasses = `
    font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent
    transition-all duration-300 ease-in-out
    ${isScrolled ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"}
  `;

  return (
    <>
      <header className={headerClasses}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo + Título */}
          <div className="flex items-center gap-4">
            <div className={logoContainerClasses}>
              <Image
                src="/android-chrome-192x192.png"
                alt="Brinca-AI"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h1 className={titleClasses}>Brinca-AI</h1>
              <p className={`text-xs text-purple-600 font-medium hidden md:block transition-all ${isScrolled ? "opacity-0 h-0" : "opacity-100"}`}>
                brincadeiras mágicas com IA
              </p>
            </div>
          </div>

          {/* Botões da Direita */}
          <div className="hidden md:flex items-center gap-3">
            {user && <SupporterBadge isCompact={isScrolled} />}

            {!loading && !user && (
              <button
                // 4. AQUI MUDOU: Em vez de chamar login direto, abrimos o modal
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 rounded-full bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-200 hover:bg-purple-700 hover:scale-105 transition-all"
              >
                <LogIn size={16} />
                Entrar
              </button>
            )}

            {!loading && user && (
              <div className="flex items-center gap-2">
                 {/* Exemplo de Avatar simples se quiser */}
                 {user.photoURL && (
                   <Image 
                     src={user.photoURL} 
                     alt="User" 
                     width={32} 
                     height={32} 
                     className="rounded-full border border-purple-200"
                   />
                 )}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 5. Renderização do Modal fora do Header (via Portal internamente) */}
      <Modal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        title="Acesse sua conta"
      >
        <LoginModalContent onLogin={handleLoginTrigger} />
      </Modal>
    </>
  );
}