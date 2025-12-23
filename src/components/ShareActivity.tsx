//src/components/ShareActivity.tsx

"use client";

import { useState } from "react";
import { Share2, Instagram, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { shareActivityAction } from "@/lib/actions"; // ✅ Confirme se o caminho é esse ou @/lib/actions

type ShareActivityProps = {
  activityContent: string;
  theme: string;
  age: string;
};

export function ShareActivity({ activityContent, theme, age }: ShareActivityProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [instagram, setInstagram] = useState("");
  const [name, setName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  async function handleShare() {
    if (!user) return alert("Você precisa estar logado para aparecer na vitrine! 🔒");
    if (!name) return alert("Como prefere ser chamada? Digite seu nome.");
    if (!acceptedTerms) return alert("Confirme que aceita compartilhar a atividade.");

    setLoading(true);
    
    // Chamada à Server Action
    const result = await shareActivityAction({
        authorName: name,
        authorId: user.uid,
        instagramHandle: instagram.replace("@", "").trim(), // Limpa o @ se a pessoa colocar
        
        // 🛠️ CORREÇÃO DO ERRO DE TIPO AQUI:
        // O TypeScript exige 'undefined' em vez de 'null' para campos opcionais (?)
        // Se user.photoURL for null, passamos undefined.
        authorPhoto: user.photoURL || undefined,
        
        content: activityContent,
        theme,
        age
    });

    if (result.success) {
      setSuccess(true);
      setIsOpen(false);
    } else {
      alert("Erro ao publicar. Tente novamente.");
    }
    
    setLoading(false);
  }

  // --- Renderização de Sucesso ---
  if (success) {
    return (
      <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 text-center animate-in fade-in">
        <p className="text-green-800 font-bold flex items-center justify-center gap-2">
          <CheckCircle2 size={18} /> Publicado com sucesso!
        </p>
        <p className="text-xs text-green-600 mt-1">Obrigado por inspirar outros professores 💜</p>
      </div>
    );
  }
  
  // --- Botão Inicial (Fechado) ---
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-6 w-full py-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-purple-300 text-purple-700 font-bold hover:bg-purple-50 transition"
      >
        <Share2 size={18} />
        Publicar na Vitrine da Comunidade
      </button>
    );
  }

  // --- Formulário (Aberto) ---
  return (
    <div className="mt-6 p-6 bg-white border border-purple-100 rounded-2xl shadow-lg space-y-4 animate-in slide-in-from-top-2">
        <h4 className="font-bold text-slate-800">Divulgar na Vitrine 🌟</h4>
      
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase">Seu Nome</label>
        <input 
          value={name} onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          placeholder="Ex: Prof. Ana"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase">Instagram (Opcional)</label>
        <div className="relative mt-1">
          {/* Se Instagram der erro de importação, troque por <Share2 size={16} ... /> */}
          <Instagram size={16} className="absolute left-3 top-2.5 text-slate-400"/>
          <input 
            value={instagram} onChange={(e) => setInstagram(e.target.value)}
            className="w-full pl-9 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="@seu.perfil"
          />
        </div>
      </div>

      <div className="flex items-start gap-2 py-2">
        <input 
          type="checkbox" 
          id="terms"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
        />
        <label htmlFor="terms" className="text-xs text-slate-500 leading-tight cursor-pointer">
          Autorizo a exibição pública desta atividade e do meu nome na vitrine do Brinca-AI.
        </label>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setIsOpen(false)} className="flex-1 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancelar</button>
        <button 
          onClick={handleShare} 
          disabled={loading || !acceptedTerms}
          className="flex-1 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 flex justify-center items-center transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Publicar"}
        </button>
      </div>
    </div>
  );
}