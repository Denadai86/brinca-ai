// src/lib/storage.ts

export interface SavedActivity {
  id: string;
  date: string;
  theme: string;
  target: string;
  content: string;
}

const STORAGE_KEY = 'brinca_ai_history_v1';

/**
 * Salva uma nova atividade no LocalStorage
 */
export const saveActivity = (activity: Omit<SavedActivity, 'id' | 'date'>) => {
  if (typeof window === 'undefined') return;

  try {
    const history = getHistory();
    
    const newEntry: SavedActivity = {
      ...activity,
      id: crypto.randomUUID(), // Gera um ID único e moderno
      date: new Date().toISOString(),
    };

    // Mantém apenas as últimas 50 atividades para não sobrecarregar o navegador
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    
    // Dispara um evento para avisar outras partes do app que o histórico mudou
    window.dispatchEvent(new Event('storage-update'));
    
    return newEntry;
  } catch (error) {
    console.error("Erro ao salvar no LocalStorage:", error);
    return null;
  }
};

/**
 * Recupera o histórico de atividades
 */
export const getHistory = (): SavedActivity[] => {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao ler do LocalStorage:", error);
    return [];
  }
};

/**
 * Remove uma atividade específica ou limpa tudo
 */
export const deleteActivity = (id: string) => {
  if (typeof window === 'undefined') return;
  
  const history = getHistory();
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('storage-update'));
};