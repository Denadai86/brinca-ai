"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Star, Cloud, Ghost, Pizza, Coffee } from "lucide-react";

// Biblioteca de Temas "Trend" (Fácil de atualizar/expandir)
const LOADING_THEMES = [
  {
    char: "Stitch 🏝️",
    msg: "Ohana quer dizer família... e sua atividade está ficando mágica!",
    color: "bg-blue-500",
    icon: <Heart className="text-white fill-white" />
  },
  {
    char: "Zootopia 🦊",
    msg: "Em Zootopia você pode ser o que quiser... inclusive um super professor!",
    color: "bg-orange-500",
    icon: <Star className="text-white fill-white" />
  },
  {
    char: "Pizza 🍕",
    msg: "Preparando uma fatia de conhecimento quentinha para você...",
    color: "bg-orange-500",
    icon: <Pizza className="text-white fill-white" />
  },
  {
    char: "Coffee Break ☕",
    msg: "Aproveite para tomar um café enquanto preparamos tudo para você...",
    color: "bg-orange-500",
    icon: <Coffee className="text-white fill-white" />
  },
  {
    char: "Bobbie Goods 🧸",
    msg: "Colorindo os últimos detalhes com muita fofura...",
    color: "bg-pink-300",
    icon: <Cloud className="text-white fill-white" />
  },
  {
    char: "Inside Out 🧠",
    msg: "A Alegria está organizando as ideias para sua atividade!",
    color: "bg-yellow-400",
    icon: <Sparkles className="text-white" />
  },
  {
    char: "Minecraft ⛏️",
    msg: "Minerando os melhores blocos de conhecimento...",
    color: "bg-green-600",
    icon: <Ghost className="text-white" />
  }
];

export function MagicLoading() {
  const [themeIndex, setThemeIndex] = useState(0);

  // Troca a frase a cada 3 segundos durante o loading
  useEffect(() => {
    const timer = setInterval(() => {
      setThemeIndex((prev) => (prev + 1) % LOADING_THEMES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const current = LOADING_THEMES[themeIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-xl p-6 text-center"
    >
      <div className="relative mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={themeIndex}
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.2, opacity: 0, rotate: 20 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`flex h-24 w-24 items-center justify-center rounded-[2.5rem] shadow-2xl ${current.color}`}
          >
            {current.icon}
          </motion.div>
        </AnimatePresence>
        
        {/* Orbes flutuantes */}
        <div className="absolute -top-4 -right-4 h-8 w-8 animate-bounce rounded-full bg-purple-200 blur-sm" />
        <div className="absolute -bottom-2 -left-6 h-6 w-6 animate-pulse rounded-full bg-pink-200 blur-sm" />
      </div>

      <div className="max-w-xs space-y-3">
        <motion.p 
          key={current.char}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xs font-black uppercase tracking-widest text-slate-400"
        >
          {current.char}
        </motion.p>
        
        <motion.h3 
          key={current.msg}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-bold leading-tight text-slate-800"
        >
          {current.msg}
        </motion.h3>
      </div>

      {/* Barra de progresso fake mas reconfortante */}
      <div className="mt-10 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className={`h-full w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent`}
        />
      </div>
    </motion.div>
  );
}