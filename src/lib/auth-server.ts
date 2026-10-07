// src/lib/auth-server.ts
import "server-only";
import { adminAuth } from "@/lib/firebase-admin";

export type VerifiedUser = {
  uid: string;
  name: string | null;
  picture: string | null;
};

/**
 * Valida o ID token do Firebase enviado pelo cliente.
 * Retorna null se ausente, malformado, expirado ou revogado — nunca lança.
 *
 * Regra de ouro das server actions: a identidade vem DAQUI, nunca de um campo
 * (authorId, userId...) enviado pelo browser.
 */
export async function verifyUser(idToken: unknown): Promise<VerifiedUser | null> {
  if (typeof idToken !== "string" || idToken.length < 20 || idToken.length > 4096) {
    return null;
  }
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    return {
      uid: decoded.uid,
      name: typeof decoded.name === "string" ? decoded.name : null,
      picture: typeof decoded.picture === "string" ? decoded.picture : null,
    };
  } catch {
    return null;
  }
}
