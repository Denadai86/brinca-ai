//src/lib/firebase-admin.ts

import "server-only";
import admin from "firebase-admin";

export function createFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (serviceAccountBase64) {
    try {
      const buffer = Buffer.from(serviceAccountBase64, "base64");
      const serviceAccount = JSON.parse(buffer.toString("utf-8"));

      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error("❌ Erro ao decodificar FIREBASE_SERVICE_ACCOUNT_BASE64:", error);
    }
  }

  throw new Error("❌ ERRO FATAL: Variável FIREBASE_SERVICE_ACCOUNT_BASE64 não encontrada ou inválida.");
}

const app = createFirebaseAdminApp();

export const db = app.firestore();
export const adminAuth = admin.auth(app);
