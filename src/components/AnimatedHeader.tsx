//src/components/AnimatedHeader.tsx

"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { SupporterBadge } from "@/components/SupporterBadge";
import { useAuth } from "@/auth/AuthProvider";
import { LogIn, LogOut } from "lucide-react";

// Defina o limite de rolagem após o qual o header deve diminuir
const SCROLL_THRESHOLD = 50;

// Altura do logo
const logoSize = {
  default: "w-12 h-12 md:w-16 md:h-16",
  scrolled: "w-10 h-10 md:w-12 md:h-12",
};

// Padding vertical do header
const headerPadding = {
  default: "py-4",
  scrolled: "py-2",
};

export function AnimatedHeader() {
  // 🔐 AUTH AQUI DENTRO (local correto)
  const { user, login, logout, loading } = useAuth();

  // Estado para controlar se o usuário rolou o suficiente
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos > SCROLL_THRESHOLD && !isScrolled) {
      setIsScrolled(true);
    } else if (currentScrollPos <= SCROLL_THRESHOLD && isScrolled) {
      setIsScrolled(false);
    }
  }, [isScrolled]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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

  const subtitleClasses = `
    text-xs text-purple-600 font-medium hidden md:block
    transition-opacity duration-300 ease-in-out
    ${isScrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}
  `;

  return (
    <header className={headerClasses}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo + título */}
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
            <p className={subtitleClasses}>brincadeiras mágicas com IA</p>
          </div>
        </div>

        {/* Direita: badge + auth + domínio */}
        <div className="hidden md:flex items-center gap-3">
          {user && <SupporterBadge isCompact={isScrolled} />}

          {!loading && !user && (
            <button
              onClick={login}
              className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-bold text-white hover:bg-purple-700 transition"
            >
              <LogIn size={16} />
              Entrar
            </button>
          )}

          {!loading && user && (
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-300 transition"
            >
              <LogOut size={16} />
              Sair
            </button>
          )}

          <span className="text-purple-700 font-medium text-sm">
            acaoleve.com
          </span>
        </div>
      </div>
    </header>
  );
}
