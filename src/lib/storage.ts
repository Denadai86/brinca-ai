// src/lib/storage.ts
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface StoredActivity {
  id?: string;
  theme: string;
  target: string;
  content: string;
  createdAt?: any;
}

const LOCAL_KEY = "brinca_ai_history";

/**
 * Salva a atividade gerada.
 * - Se tiver user logado: Salva no Firestore (Nuvem)
 * - Sempre: Salva no LocalStorage (Histórico local rápido)
 */
export async function saveActivity(data: StoredActivity) {
  try {
    // 1. Salvar no LocalStorage (Backup imediato/Guest)
    const current = getLocalActivities();
    const newActivity = { ...data, createdAt: new Date().toISOString() };
    const updated = [newActivity, ...current].slice(0, 10); // Mantém apenas as últimas 10 no local
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));

    // 2. Salvar no Firestore (Se estiver logado)
    const user = auth.currentUser;
    if (user) {
      // Cria uma subcoleção 'activities' dentro do documento do usuário
      // Caminho: users/{uid}/activities/{docId}
      await addDoc(collection(db, "users", user.uid, "activities"), {
        theme: data.theme,
        target: data.target,
        content: data.content,
        createdAt: serverTimestamp(), // Usa a hora do servidor (confiável)
      });
      console.log("📝 Atividade salva na nuvem com sucesso!");
    }

  } catch (error) {
    console.error("Erro ao salvar atividade:", error);
  }
}

/**
 * Recupera atividades apenas do LocalStorage (por enquanto)
 */
export function getLocalActivities(): StoredActivity[] {
  if (typeof window === "undefined") return [];
  
  const stored = localStorage.getItem(LOCAL_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}