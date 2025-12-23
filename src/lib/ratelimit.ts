import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// Regra: 5 gerações a cada 1 hora por IP/User
const LIMIT_COUNT = 5;
const LIMIT_WINDOW = 1000 * 60 * 60; // 1 hora

export async function checkRateLimit(identifier: string): Promise<boolean> {
  if (!identifier) return true; // Se não identificar, deixa passar (ou bloqueia, depende da estratégia)

  const limitRef = db.collection("rate_limits").doc(identifier);
  const snapshot = await limitRef.get();
  const now = Date.now();

  if (!snapshot.exists) {
    // Primeiro acesso
    await limitRef.set({
      count: 1,
      resetAt: now + LIMIT_WINDOW
    });
    return true;
  }

  const data = snapshot.data();
  
  // Se a janela de tempo expirou, reseta
  if (now > data?.resetAt) {
    await limitRef.set({
      count: 1,
      resetAt: now + LIMIT_WINDOW
    });
    return true;
  }

  // Se estourou o limite
  if (data?.count >= LIMIT_COUNT) {
    return false;
  }

  // Incrementa
  await limitRef.update({
    count: FieldValue.increment(1)
  });

  return true;
}