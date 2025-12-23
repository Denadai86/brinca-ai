"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase-admin"; //
import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { headers } from "next/headers";
// Certifique-se de que o arquivo src/lib/ratelimit.ts existe conforme conversamos
import { checkRateLimit } from "./ratelimit"; 
import { GeminiListResponse, GeminiModelRaw, GenerationResponse, ActivityData } from "@/types/gemini";

// --- INICIALIZAÇÃO SEGURA ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("FATAL: GEMINI_API_KEY não configurada.");
}
const genAI = new GoogleGenerativeAI(apiKey);

// --- CACHE DE MODELOS (Estratégia de Resiliência) ---
let cachedModels: string[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

// 1. DESCOBERTA DE MODELOS
async function getDynamicModelList(): Promise<string[]> {
  const now = Date.now();
  if (cachedModels && (now - lastCacheTime < CACHE_DURATION)) {
    return cachedModels;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) throw new Error(`Google API Error: ${response.statusText}`);
    
    const data = (await response.json()) as GeminiListResponse;
    
    const models = data.models
      .filter((m: GeminiModelRaw) => 
        m.supportedGenerationMethods.includes("generateContent") &&
        !m.name.includes("vision") && 
        !m.name.includes("embedding") &&
        !m.name.includes("aqa")
      )
      .map((m) => m.name.replace("models/", ""));

    // Ordenação: Flash > Pro > Mais novos
    const sortedModels = models.sort((a, b) => {
      const aScore = (a.includes("flash") ? 2 : 0) + (a.includes("pro") ? 1 : 0);
      const bScore = (b.includes("flash") ? 2 : 0) + (b.includes("pro") ? 1 : 0);
      if (aScore !== bScore) return bScore - aScore; 
      return b.localeCompare(a);
    });

    cachedModels = sortedModels;
    lastCacheTime = now;
    return sortedModels;
  } catch (error) {
    console.error("⚠️ Fallback de modelos ativado:", error);
    return ["gemini-1.5-flash", "gemini-1.5-pro"];
  }
}

// 2. GERAÇÃO (Com Rate Limit)
export async function generateActivities(formData: FormData): Promise<GenerationResponse> {
  try {
    // 🛡️ Segurança: Rate Limit por IP
    const ip = headers().get("x-forwarded-for") || "unknown";
    const canProceed = await checkRateLimit(ip);
    
    if (!canProceed) {
      return { 
        success: false, 
        error: "Limite de gerações excedido. Tente novamente em 1 hora ou torne-se um apoiador!" 
      };
    }

    const tema = formData.get("tema") as string;
    const idade = formData.get("idade") as string;
    const tipoIdade = formData.get("tipoIdade") as string;

    if (!tema || !idade) return { success: false, error: "Dados incompletos." };

    const prompt = `
    Atue como uma pedagoga especialista na BNCC.
    Crie 2 (DUAS) variações de atividades lúdicas para crianças de ${idade} (${tipoIdade}), com o tema "${tema}".
    
    ⚠️ ESTRUTURA OBRIGATÓRIA:
    [TITULO] (Nome criativo)
    [MOTIVACIONAL] (Frase curta)
    [MATERIAIS] (Bullet points)
    [PEDAGOGICO] (Objetivo breve da BNCC)
    [PASSO_A_PASSO] (Numerado)

    Separador entre atividades: ===SEPARADOR===
    Não adicione introduções ou conclusões fora do formato.
    `;

    const models = await getDynamicModelList();
    let textResult = "";

    // Tentativa em cascata (Fallback)
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text) {
          textResult = text;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!textResult) throw new Error("IA indisponível no momento.");

    // Salva automaticamente
    const activities = textResult.split("===SEPARADOR===");
    const savePromises = activities
      .filter(content => content.trim().length > 50)
      .map(async (content) => {
        return db.collection("public_activities").add({
          tema,
          target: `${idade} (${tipoIdade})`,
          content: content.trim(),
          categoria: tipoIdade === "idade" ? "maternal" : "pre",
          createdAt: new Date(),
          likes: 0
        });
      });

    await Promise.all(savePromises);
    revalidatePath("/vitrine");
    
    const displayData = textResult.replace("===SEPARADOR===", "\n\n✨ --- OUTRA OPÇÃO --- ✨\n\n");
    return { success: true, data: displayData };

  } catch (error) {
    console.error("Erro na geração:", error);
    return { success: false, error: "Erro interno ao gerar atividade." };
  }
}

// 3. LEITURA (Refatorada para Filtros e Ordenação)
export async function getPublicActivities(
  orderByField: "createdAt" | "likes" = "createdAt", 
  limitCount: number = 12,
  categoryFilter: string = "todos" // ✅ NOVO PARÂMETRO
) {
  try {
    let query: FirebaseFirestore.Query = db.collection("public_activities");

    // Aplica filtro se não for "todos"
    if (categoryFilter && categoryFilter !== "todos") {
      query = query.where("categoria", "==", categoryFilter);
    }
    
    // ATENÇÃO: Se usar Filtro + OrderBy, o Firebase pode pedir índice composto.
    const snapshot = await query
      .orderBy(orderByField, "desc")
      .limit(limitCount)
      .get();

    const data: ActivityData[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<ActivityData, "id">),
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || new Date().toISOString()
    }));

    return { success: true, data };
  } catch (error) {
    console.error(`Erro ao buscar atividades (Filtro: ${categoryFilter}):`, error);
    return { success: false, data: [] };
  }
}

// 4. INTERAÇÕES SOCIAIS
export async function shareActivityAction(data: {
  authorName: string;
  authorId?: string;
  instagramHandle: string;
  authorPhoto?: string;
  content: string;
  theme: string;
  age: string;
}) {
  try {
    await db.collection("public_activities").add({
      tema: data.theme,
      target: data.age,
      content: data.content,
      categoria: "comunidade",
      createdAt: new Date(),
      likes: 0,
      authorName: data.authorName,
      authorId: data.authorId || null,
      authorPhoto: data.authorPhoto || null,
      instagramHandle: data.instagramHandle.replace("@", "").trim(),
    });

    revalidatePath("/vitrine");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro share:", error);
    return { success: false, error: "Erro ao compartilhar" };
  }
}

export async function toggleLikeAction(activityId: string) {
  try {
    await db.collection("public_activities").doc(activityId).update({
      likes: FieldValue.increment(1)
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 5. DASHBOARD USER
export async function getUserActivities(userId: string) {
  try {
    const snapshot = await db.collection("public_activities")
      .where("authorId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any),
      createdAt: doc.data().createdAt?.toDate().toISOString()
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Erro getUserActivities:", error);
    return { success: false, data: [] };
  }
}