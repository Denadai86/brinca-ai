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
      icon: <HelpCircle size={20} />, 
      activeClass: "border-blue-500 text-blue-600 bg-blue-50 shadow-md shadow-blue-100",
      inactiveClass: "border-slate-100 text-slate-400"
    },
    { 
      id: "shelf", 
      label: "Exemplos", 
      icon: <LayoutGrid size={20} />, 
      activeClass: "border-pink-500 text-pink-600 bg-pink-50 shadow-md shadow-pink-100",
      inactiveClass: "border-slate-100 text-slate-400"
    },
    { 
      id: "how", 
      label: "Tutorial", 
      icon: <Settings size={20} />, 
      activeClass: "border-amber-500 text-amber-600 bg-amber-50 shadow-md shadow-amber-100",
      inactiveClass: "border-slate-100 text-slate-400"
    },
    { 
      id: "generator", 
      label: "CRIAR", 
      icon: <Wand2 size={20} />, 
      activeClass: "border-purple-600 text-purple-700 bg-purple-50 shadow-md shadow-purple-100 ring-2 ring-purple-500/10",
      inactiveClass: "border-slate-100 text-slate-400"
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {shortcuts.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`
            flex items-center gap-3 p-3 md:p-6 rounded-2xl md:rounded-[2.5rem] border-2 transition-all duration-300
            ${activeSection === item.id ? item.activeClass : `${item.inactiveClass} bg-white`}
          `}
        >
          {/* Ícone menor no mobile para caber o texto ao lado */}
          <div className={`shrink-0 ${activeSection === item.id ? "scale-110" : ""}`}>
            {item.icon}
          </div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-tight md:tracking-widest">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}