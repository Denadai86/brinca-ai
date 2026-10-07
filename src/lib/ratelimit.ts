// src/lib/ratelimit.ts
import "server-only";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { DocumentReference, FieldValue, Timestamp } from "firebase-admin/firestore";
import { db } from "@/lib/firebase-admin";

/** Janela única de 1h. Ajuste os limites aqui. */
const WINDOW_MS = 60 * 60 * 1000;

export const GENERATE_LIMITS = {
  anon: 5, //       sem login (por IP)
  user: 10, //      logado
  supporter: 30, // apoiador (isSupporter === true)
} as const;

export const SHARE_LIMIT = 10; // publicações na vitrine por hora, por usuário

type Scope = "generate" | "share";
type Subject = { kind: "uid" | "ip"; value: string };

/**
 * IP do cliente. No Vercel o x-forwarded-for é definido pela plataforma; ele pode
 * trazer uma lista ("cliente, proxy1, proxy2"), e o cliente real é o primeiro item.
 */
export function getClientIp(): string {
  const h = headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "";
  return ip || "unknown";
}

// O id do documento é um hash: o IP (dado pessoal, LGPD) não fica em texto puro no banco.
function bucketRef(scope: Scope, subject: Subject): DocumentReference {
  const hash = createHash("sha256").update(subject.value).digest("hex").slice(0, 32);
  return db.collection("rate_limits").doc(`${scope}_${subject.kind}_${hash}`);
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  ref: DocumentReference;
};

/**
 * Consome 1 unidade da cota. Leitura + escrita em UMA transação: duas requisições
 * simultâneas não conseguem mais "furar" o limite.
 *
 * `expireAt` serve para uma política de TTL do Firestore (ver instruções) — sem ela
 * a coleção rate_limits cresce para sempre.
 */
export async function consumeRateLimit(params: {
  scope: Scope;
  subject: Subject;
  limit: number;
}): Promise<RateLimitResult> {
  const { scope, subject, limit } = params;
  const ref = bucketRef(scope, subject);
  const now = Date.now();

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() as { count: number; resetAt: number } | undefined;

    if (!data || now >= data.resetAt) {
      const resetAt = now + WINDOW_MS;
      tx.set(ref, {
        count: 1,
        resetAt,
        expireAt: Timestamp.fromMillis(resetAt + WINDOW_MS),
      });
      return { allowed: true, remaining: limit - 1, resetAt, ref };
    }

    if (data.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: data.resetAt, ref };
    }

    tx.update(ref, { count: FieldValue.increment(1) });
    return { allowed: true, remaining: limit - data.count - 1, resetAt: data.resetAt, ref };
  });
}

/** Devolve a unidade quando a falha foi nossa (IA fora do ar etc.). Nunca lança. */
export async function refundRateLimit(ref: DocumentReference): Promise<void> {
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (snap.exists && (snap.data()?.count ?? 0) > 0) {
        tx.update(ref, { count: FieldValue.increment(-1) });
      }
    });
  } catch (error) {
    console.error("[ratelimit] falha ao devolver cota:", error);
  }
}
