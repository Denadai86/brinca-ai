"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// Defina o limite de rolagem após o qual o header deve diminuir
const SCROLL_THRESHOLD = 50; // 50 pixels de rolagem

// Altura do logo:
// 'default': Classes de altura do logo
// 'scrolled': Classes de altura do logo após a rolagem
const logoSize = {
  default: "w-12 h-12 md:w-16 md:h-16",
  scrolled: "w-10 h-10 md:w-12 md:h-12",
};

// Padding vertical do header:
// 'default': Padding vertical inicial
// 'scrolled': Padding vertical reduzido
const headerPadding = {
  default: "py-4", // Ex: `py-4`
  scrolled: "py-2", // Ex: `py-2`
};

export function AnimatedHeader() {
  // Estado para controlar se o usuário rolou o suficiente
  const [isScrolled, setIsScrolled] = useState(false);

  // Função para lidar com o evento de rolagem, usando useCallback para otimização
  const handleScroll = useCallback(() => {
    // Verifica se a posição de rolagem vertical (scrollY)
    // ultrapassou o limite SCROLL_THRESHOLD
    const currentScrollPos = window.scrollY;

    // Atualiza o estado apenas se houver uma mudança de status
    if (currentScrollPos > SCROLL_THRESHOLD && !isScrolled) {
      setIsScrolled(true);
    } else if (currentScrollPos <= SCROLL_THRESHOLD && isScrolled) {
      setIsScrolled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrolled]); // Dependência em 'isScrolled' para garantir a lógica de transição

  // Hook para anexar o listener de rolagem ao window
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Função de limpeza para remover o listener quando o componente for desmontado
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Classes dinâmicas para a animação
  // 'transition-all duration-300' garante a suavidade do efeito.
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
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center md:justify-between">
        {/* --- Bloco do Logo e Título --- */}
        <div className="flex items-center gap-4">
          <div className={logoContainerClasses}>
            <Image
              src="/android-chrome-192x192.png"
              alt="Brinca-AI"
              // O tamanho deve ser grande o suficiente para o maior estado (default)
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
        {/* --- Bloco do Subdomínio (Fixo) --- */}
        <div className="hidden md:block text-purple-700 font-medium text-sm">
          acaoleve.com
        </div>
      </div>
    </header>
  );
}