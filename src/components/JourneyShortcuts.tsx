"use client";

import { HelpCircle, LayoutGrid, Settings, Wand2 } from "lucide-react";

export type SectionType = "pain" | "shelf" | "how" | "generator";

interface JourneyShortcutsProps {
  activeSection: SectionType;
  onSelect: (section: SectionType) => void;
}

export function JourneyShortcuts({ activeSection, onSelect }: JourneyShortcutsProps) {
  const shortcuts = [
    { 
      id: "pain", 
      label: "Para mim?", 
      icon: <HelpCircle size={18} />, 
      // ESTADO ATIVO: Cor vibrante + Texto Branco
      activeClass: "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 ring-2 ring-blue-600 ring-offset-2",
      // ESTADO INATIVO: Cor Pastel + Texto Colorido (Parece botão clicável)
      inactiveClass: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
    },
    { 
      id: "how", 
      label: "Tutorial", 
      icon: <Settings size={18} />, 
      activeClass: "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-200 ring-2 ring-amber-500 ring-offset-2",
      inactiveClass: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
    },
    { 
      id: "shelf", 
      label: "Exemplos", 
      icon: <LayoutGrid size={18} />, 
      activeClass: "bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-200 ring-2 ring-pink-500 ring-offset-2",
      inactiveClass: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
    },
    { 
      id: "generator", 
      label: "CRIAR", 
      icon: <Wand2 size={18} />, 
      activeClass: "bg-purple-600 text-white border-purple-600 shadow-xl shadow-purple-300 ring-2 ring-purple-600 ring-offset-2 scale-105",
      inactiveClass: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 font-bold"
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {shortcuts.map((item) => {
        const isActive = activeSection === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id as SectionType)}
            className={`
              relative flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 
              p-3 md:p-4 rounded-2xl border transition-all duration-300 active:scale-95
              ${isActive ? item.activeClass : item.inactiveClass}
            `}
          >
            {/* O ícone muda de cor automaticamente por herdar o 'text-color' do pai */}
            <div className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
              {item.icon}
            </div>
            
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
              {item.label}
            </span>
            
            {/* Indicador visual extra para mobile (Bolinha) */}
            {isActive && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-current"></span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}