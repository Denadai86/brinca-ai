"use client";

import { useState } from "react";
import { Share2, Instagram, CheckCircle2, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/auth/AuthProvider"; // Importe seu hook de auth

type ShareActivityProps = {
  activityContent: string;
  theme: string;
  age: string;
};

export function ShareActivity({ activityContent, theme, age }: ShareActivityProps) {
  const { user } = useAuth(); // Pega o usuário logado
  const [isOpen, setIsOpen] = useState(false);
  const [instagram, setInstagram] = useState("");
  const [name, setName] = useState(user?.displayName || ""); // Tenta preencher auto
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false); // Checkbox de consentimento

  async function handleShare() {
    if (!user) return alert("Você precisa estar logado para aparecer na vitrine! 🔒");
    if (!name) return alert("Como prefere ser chamada? Digite seu nome.");
    if (!acceptedTerms) return alert("Confirme que aceita compartilhar a atividade.");

    setLoading(true);
    try {
      await addDoc(collection(db, "community_feed"), {
        authorName: name,
        authorId: user.uid, // Importante para segurança futura
        instagramHandle: instagram.replace("@", "").trim(),
        content: activityContent,
        theme,
        age,
        status: "approved", // Otimista (já validado pelo Prompt Blindado)
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setIsOpen(false);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao publicar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <div className="mt-6 p-6 bg-white border border-purple-100 rounded-2xl shadow-lg space-y-4">
      <h4 className="font-bold text-slate-800">Divulgar na Vitrine 🌟</h4>
      
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase">Seu Nome</label>
        <input 
          value={name} onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg text-sm"
          placeholder="Ex: Prof. Ana"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase">Instagram (Opcional)</label>
        <div className="relative mt-1">
          <Instagram size={16} className="absolute left-3 top-2.5 text-slate-400"/>
          <input 
            value={instagram} onChange={(e) => setInstagram(e.target.value)}
            className="w-full pl-9 p-2 border rounded-lg text-sm"
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
          className="mt-1 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
        />
        <label htmlFor="terms" className="text-xs text-slate-500 leading-tight">
          Autorizo a exibição pública desta atividade e do meu nome na vitrine do Brinca-AI.
        </label>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setIsOpen(false)} className="flex-1 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancelar</button>
        <button 
          onClick={handleShare} 
          disabled={loading || !acceptedTerms}
          className="flex-1 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 flex justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Publicar"}
        </button>
      </div>
    </div>
  );
}