import "server-only";
import admin from "firebase-admin";

export function createFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // 1. Tenta pegar a variável BASE64 (A prova de falhas)
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (serviceAccountBase64) {
    try {
      // Decodifica a string base64 de volta para texto JSON
      const buffer = Buffer.from(serviceAccountBase64, 'base64');
      const serviceAccount = JSON.parse(buffer.toString('utf-8'));

      console.log("✅ [Firebase Admin] Carregado via Base64.");

      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error("❌ Erro ao decodificar Base64:", error);
    }
  }

  throw new Error("❌ ERRO FATAL: Variável FIREBASE_SERVICE_ACCOUNT_BASE64 não encontrada ou inválida.");
}

export const db = createFirebaseAdminApp().firestore();