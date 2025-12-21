"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Bloqueia o scroll da página quando aberto
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Fecha com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl animate-in zoom-in-95 duration-200 border border-purple-100">
        <div className="flex items-center justify-between border-b border-slate-100 p-6 bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-800">{title}</h3>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
