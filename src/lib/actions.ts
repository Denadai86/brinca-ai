"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// --- CACHE DE MODELOS (Para não consultar a API toda hora) ---
// Variável global no escopo do servidor (dura enquanto o container estiver "quente")
let cachedModels: string[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora de cache

// --- FUNÇÃO DE DESCOBERTA AUTOMÁTICA ---
async function getDynamicModelList(): Promise<string[]> {
  // 1. Se tiver cache válido, usa ele (Performance)
  const now = Date.now();
  if (cachedModels && (now - lastCacheTime < CACHE_DURATION)) {
    return cachedModels;
  }

  try {
    console.log("🔄 Buscando lista atualizada de modelos no Google...");
    
    // Bate na API REST do Google para listar modelos
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    if (!response.ok) throw new Error("Falha ao listar modelos");
    
    const data = await response.json();
    
    // 2. Filtragem Inteligente
    const models = data.models
      .filter((m: any) => 
        // Deve suportar geração de conteúdo
        m.supportedGenerationMethods.includes("generateContent") &&
        // Não pode ser modelo só de visão ou embedding legado
        !m.name.includes("vision") && 
        !m.name.includes("embedding") &&
        !m.name.includes("aqa")
      )
      .map((m: any) => m.name.replace("models/", "")); // Limpa o nome (tira o prefixo)

    // 3. Ordenação Estratégica (Flash primeiro, depois Pro, depois o resto)
    const sortedModels = models.sort((a: string, b: string) => {
      // Flash tem prioridade (velocidade/custo)
      const aFlash = a.includes("flash");
      const bFlash = b.includes("flash");
      if (aFlash && !bFlash) return -1;
      if (!aFlash && bFlash) return 1;

      // Pro vem em segundo
      const aPro = a.includes("pro");
      const bPro = b.includes("pro");
      if (aPro && !bPro) return -1;
      if (!aPro && bPro) return 1;

      // Mais novos primeiro (geralmente têm números maiores ou 'latest')
      return b.localeCompare(a); 
    });

    console.log("📋 Modelos encontrados (auto):", sortedModels.slice(0, 3));
    
    // Salva no cache
    cachedModels = sortedModels;
    lastCacheTime = now;
    
    return sortedModels;
  } catch (error) {
    console.error("⚠️ Falha no auto-discovery. Usando lista manual.", error);
    // Fallback de segurança se a API de listagem falhar
    return ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-3-flash-preview"];
  }
}

// --- FUNÇÃO DE GERAÇÃO COM FALLBACK DINÂMICO ---
async function generateWithFallback(prompt: string): Promise<string> {
  // Pega a lista automática
  const modelosDisponiveis = await getDynamicModelList();

  for (const modelName of modelosDisponiveis) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      
      const texto = result.response.text();
      if (!texto) throw new Error("Vazio");

      console.log(`✅ Sucesso com: ${modelName}`);
      return texto;

    } catch (error: any) {
      // Ignora erros e tenta o próximo da lista
      // console.warn(`Pulo: ${modelName} falhou.`);
      continue;
    }
  }
  throw new Error("Nenhum modelo disponível conseguiu gerar a resposta.");
}

// --- 1. ACTION PRINCIPAL (A Mesma Lógica de Antes) ---
export async function generateActivities(formData: FormData) {
  try {
    const tema = formData.get("tema") as string;
    const idade = formData.get("idade") as string;
    const tipoIdade = formData.get("tipoIdade") as string;

    const prompt = `
    Atue como uma pedagoga especialista na BNCC.
    Crie 2 (DUAS) variações de atividades lúdicas para crianças de ${idade} (${tipoIdade}), com o tema "${tema}".
    
    ⚠️ REGRA DE FORMATAÇÃO E SEPARAÇÃO:
    
    1. Estrutura de CADA atividade (Use exatamente estas tags):
    [TITULO] (Nome criativo)
    [MOTIVACIONAL] (Frase curta)
    [MATERIAIS] (Lista bullet points)
    [PEDAGOGICO] (Objetivo breve)
    [PASSO_A_PASSO] (Instruções numeradas)

    2. IMPORTANTE: Entre a Atividade 1 e a Atividade 2, insira EXATAMENTE e APENAS esta linha separadora:
    ===SEPARADOR===
    
    Comece direto com [TITULO] da primeira.
    `;

    // Chama nossa nova função ultra-inteligente
    const fullText = await generateWithFallback(prompt);

    // Corta e Salva
    const atividadesArray = fullText.split("===SEPARADOR===");

    const savePromises = atividadesArray.map(async (atividadeContent) => {
      const contentClean = atividadeContent.trim();
      if (contentClean.length > 50) { 
        return db.collection("public_activities").add({
          tema,
          target: `${idade} (${tipoIdade})`,
          content: contentClean,
          categoria: tipoIdade === "idade" ? "maternal" : "pre",
          createdAt: new Date(),
          likes: 0
        });
      }
      return Promise.resolve(null);
    });

    await Promise.all(savePromises);
    revalidatePath("/");
    
    return { success: true, data: fullText.replace("===SEPARADOR===", "\n\n✨ --- OUTRA OPÇÃO --- ✨\n\n") };

  } catch (error: any) {
    console.error("Erro Fatal:", error);
    return { success: false, error: "O sistema de IA está instável no momento." };
  }
}

// --- 2. VITRINE (Mantida) ---
export async function getPublicActivities(categoria?: string) {
  try {
    let queryRef = db.collection("public_activities")
      .orderBy("createdAt", "desc")
      .limit(12);

    if (categoria && categoria !== "todos") {
       queryRef = queryRef.where("categoria", "==", categoria);
    }

    const snapshot = await queryRef.get();

    const activities = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        tema: data.tema || "Sem tema",
        target: data.target || "Geral",
        content: data.content || "",
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      };
    });

    return { success: true, data: activities };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// --- 3. SHARE (Mantida) ---
export async function shareActivityAction(data: any) {
  try {
    await db.collection("community_feed").add({ ...data, status: "approved", createdAt: new Date() });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro" };
  }
}