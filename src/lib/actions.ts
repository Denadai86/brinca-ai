"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase-admin";
import { verifyUser } from "@/lib/auth-server";
import { generateActivityPair } from "@/lib/gemini";
import {
  consumeRateLimit,
  refundRateLimit,
  getClientIp,
  GENERATE_LIMITS,
  SHARE_LIMIT,
} from "@/lib/ratelimit";
import type { ActivityData, GenerationResponse } from "@/types/gemini";

// ⚠️ Arquivo "use server": só exporte funções async. Constantes/tipos ficam sem export.
// Toda server action é um endpoint HTTP público: valide TUDO que chega do cliente.

const ORDER_FIELDS = new Set(["createdAt", "likes"]);
const CATEGORY_FILTERS = new Set(["maternal", "pre", "fundamental", "comunidade"]);
const MAX_LIST_LIMIT = 24;

// ---------------------------------------------------------------------------
// 1. GERAÇÃO
// ---------------------------------------------------------------------------
const generationInput = z.object({
  tema: z.string().trim().min(2).max(120),
  idade: z.string().trim().min(1).max(60),
  tipoIdade: z.enum(["idade", "serie"]),
  materiais: z.string().trim().max(300),
});

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

async function isSupporter(uid: string): Promise<boolean> {
  try {
    const snap = await db.collection("users").doc(uid).get();
    return snap.data()?.isSupporter === true;
  } catch {
    return false;
  }
}

export async function generateActivities(formData: FormData): Promise<GenerationResponse> {
  const parsed = generationInput.safeParse({
    tema: field(formData, "tema"),
    idade: field(formData, "idade"),
    tipoIdade: field(formData, "tipoIdade") === "serie" ? "serie" : "idade",
    materiais: field(formData, "materiais"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Opa, faltou um detalhe! Me conta o tema da aula (até 120 caracteres) e a turma (até 60), e eu preparo tudo pra você.",
    };
  }
  const input = parsed.data;

  let rateRef: Awaited<ReturnType<typeof consumeRateLimit>>["ref"] | null = null;

  try {
    // 🛡️ Identidade e cota: logado conta por uid; anônimo, por IP.
    const user = await verifyUser(formData.get("idToken"));
    const supporter = user ? await isSupporter(user.uid) : false;
    const limit = supporter
      ? GENERATE_LIMITS.supporter
      : user
        ? GENERATE_LIMITS.user
        : GENERATE_LIMITS.anon;

    const rate = await consumeRateLimit({
      scope: "generate",
      subject: user ? { kind: "uid", value: user.uid } : { kind: "ip", value: await getClientIp() },
      limit,
    });
    rateRef = rate.ref;

    if (!rate.allowed) {
      const minutes = Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 60_000));
      const wait = minutes === 1 ? "1 minutinho" : `${minutes} minutos`;
      const upsell = supporter
        ? ""
        : user
          ? " Quem apoia o projeto ganha ainda mais gerações por hora."
          : " Entrando com a sua conta, você ganha mais gerações por hora.";
      return {
        success: false,
        error: `Uau, que ritmo! Você já usou as ${limit} gerações desta hora. Volte em ${wait} e a gente continua de onde parou.${upsell}`,
      };
    }

    // 🤖 IA (saída JSON validada: não há mais parsing de texto livre)
    let activities;
    try {
      activities = await generateActivityPair(input);
    } catch (error) {
      console.error("Erro na geração:", error);
      await refundRateLimit(rate.ref); // a falha foi nossa: não gasta a cota da professora
      return {
        success: false,
        error: "Ops! Minha varinha de ideias deu uma travadinha 🪄 Não descontei nada das suas gerações. É só tentar de novo daqui a pouquinho.",
      };
    }

    // 💾 Mantém o comportamento atual (publica na vitrine). O bloco 3 muda isso para "privado por padrão".
    try {
      await Promise.all(
        activities.map((a) =>
          db.collection("public_activities").add({
            tema: input.tema,
            target: input.idade,
            content: a.content,
            categoria: a.categoria,
            createdAt: new Date(),
            likes: 0,
          })
        )
      );
      revalidatePath("/vitrine");
    } catch (error) {
      // Salvar é secundário: a professora já tem o resultado na tela.
      console.error("Erro ao salvar atividades:", error);
    }

    return { success: true, activities, tema: input.tema, target: input.idade };
  } catch (error) {
    console.error("Erro interno na geração:", error);
    if (rateRef) await refundRateLimit(rateRef);
    return { success: false, error: "Eita, algo escapuliu aqui do meu lado. Tente de novo daqui a pouquinho, tá?" };
  }
}

// ---------------------------------------------------------------------------
// 2. LEITURA PÚBLICA (vitrine/galeria)
// ---------------------------------------------------------------------------
type Row = FirebaseFirestore.DocumentData;

function toActivityData(id: string, data: Row): ActivityData {
  // Lista explícita de campos: não vaza authorId nem campos internos para o cliente.
  return {
    id,
    tema: data.tema ?? "",
    target: data.target ?? "",
    content: data.content ?? "",
    categoria: data.categoria ?? "",
    likes: typeof data.likes === "number" ? data.likes : 0,
    authorName: data.authorName ?? undefined,
    authorPhoto: data.authorPhoto ?? undefined,
    instagramHandle: data.instagramHandle ?? undefined,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
}

export async function getPublicActivities(
  orderByField: string = "createdAt",
  limitCount: number = 12,
  categoryFilter: string = "todos"
): Promise<{ success: boolean; data: ActivityData[] }> {
  try {
    // Esta action é chamada do browser (ShelfDisplay): não confie nos argumentos.
    const order = ORDER_FIELDS.has(orderByField) ? orderByField : "createdAt";
    const max = Math.min(Math.max(Math.trunc(Number(limitCount)) || 12, 1), MAX_LIST_LIMIT);

    let query: FirebaseFirestore.Query = db.collection("public_activities");
    if (CATEGORY_FILTERS.has(categoryFilter)) {
      query = query.where("categoria", "==", categoryFilter);
    }

    // Filtro + orderBy pode exigir índice composto (o erro no log traz o link para criar).
    const snapshot = await query.orderBy(order, "desc").limit(max).get();
    return { success: true, data: snapshot.docs.map((d) => toActivityData(d.id, d.data())) };
  } catch (error) {
    console.error(`Erro ao buscar atividades (filtro: ${categoryFilter}):`, error);
    return { success: false, data: [] };
  }
}

// ---------------------------------------------------------------------------
// 3. INTERAÇÕES (exigem login verificado)
// ---------------------------------------------------------------------------
const shareInput = z.object({
  authorName: z.string().trim().min(1).max(60),
  instagramHandle: z
    .string()
    .trim()
    .transform((s) => s.replace(/^@/, ""))
    .pipe(z.string().regex(/^[A-Za-z0-9._]{0,30}$/)),
  content: z.string().trim().min(50).max(8000),
  theme: z.string().trim().min(1).max(120),
  age: z.string().trim().min(1).max(60),
});

export async function shareActivityAction(
  idToken: string,
  data: {
    authorName: string;
    instagramHandle: string;
    content: string;
    theme: string;
    age: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const user = await verifyUser(idToken);
  if (!user) return { success: false, error: "Para publicar na vitrine, entre primeiro com a sua conta, tá?" };

  const parsed = shareInput.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Dê uma conferida no seu nome e no @ do Instagram: tem algo que não bateu." };
  }

  try {
    const rate = await consumeRateLimit({
      scope: "share",
      subject: { kind: "uid", value: user.uid },
      limit: SHARE_LIMIT,
    });
    if (!rate.allowed) {
      return { success: false, error: "Calma, prô! Você publicou bastante coisa em pouco tempo. Tente de novo daqui a pouco." };
    }

    const v = parsed.data;
    await db.collection("public_activities").add({
      tema: v.theme,
      target: v.age,
      content: v.content,
      categoria: "comunidade",
      createdAt: new Date(),
      likes: 0,
      // authorId e foto vêm do token verificado, nunca do cliente.
      authorId: user.uid,
      authorPhoto: user.picture,
      authorName: v.authorName,
      instagramHandle: v.instagramHandle,
    });

    revalidatePath("/vitrine");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro share:", error);
    return { success: false, error: "Não consegui publicar agora. Tente de novo daqui a pouquinho." };
  }
}

const ACTIVITY_ID = /^[A-Za-z0-9]{10,40}$/;

/**
 * Curtir é idempotente: `like: true` nunca descurte (e vice-versa). Assim, mesmo sem a UI
 * saber se você já curtiu, um clique nunca desfaz uma curtida por engano.
 * Uma curtida por usuário: documento em public_activities/{id}/likes/{uid}.
 */
export async function setLikeAction(
  idToken: string,
  activityId: string,
  like: boolean
): Promise<
  | { success: true; liked: boolean; likes: number }
  | { success: false; error: string }
> {
  const user = await verifyUser(idToken);
  if (!user) return { success: false, error: "Entre na sua conta para curtir." };
  if (typeof activityId !== "string" || !ACTIVITY_ID.test(activityId)) {
    return { success: false, error: "Atividade inválida." };
  }

  const activityRef = db.collection("public_activities").doc(activityId);
  const likeRef = activityRef.collection("likes").doc(user.uid);

  try {
    const result = await db.runTransaction(async (tx) => {
      const [activity, existing] = await Promise.all([tx.get(activityRef), tx.get(likeRef)]);
      if (!activity.exists) throw new Error("not-found");

      const current = typeof activity.data()?.likes === "number" ? activity.data()!.likes : 0;

      if (like && !existing.exists) {
        tx.set(likeRef, { createdAt: new Date() });
        tx.update(activityRef, { likes: current + 1 });
        return { liked: true, likes: current + 1 };
      }
      if (!like && existing.exists) {
        tx.delete(likeRef);
        tx.update(activityRef, { likes: Math.max(0, current - 1) });
        return { liked: false, likes: Math.max(0, current - 1) };
      }
      return { liked: existing.exists, likes: current }; // nada a mudar
    });
    return { success: true, ...result };
  } catch (error) {
    console.error("Erro ao curtir:", error);
    return { success: false, error: "Não foi possível curtir agora." };
  }
}

// ---------------------------------------------------------------------------
// 4. DASHBOARD DO USUÁRIO
// ---------------------------------------------------------------------------
export async function getUserActivities(
  idToken: string
): Promise<{ success: boolean; data: ActivityData[] }> {
  // O uid vem do token verificado — antes, qualquer um podia passar o uid de outra pessoa.
  const user = await verifyUser(idToken);
  if (!user) return { success: false, data: [] };

  try {
    const snapshot = await db
      .collection("public_activities")
      .where("authorId", "==", user.uid)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    return { success: true, data: snapshot.docs.map((d) => toActivityData(d.id, d.data())) };
  } catch (error) {
    console.error("Erro getUserActivities:", error);
    return { success: false, data: [] };
  }
}