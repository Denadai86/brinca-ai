import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxgyIsOa9YzA4or2cXLqt35CT2Zd9AKbk",
  authDomain: "brinca-ai-9ef9b.firebaseapp.com",
  projectId: "brinca-ai-9ef9b",
  storageBucket: "brinca-ai-9ef9b.firebasestorage.app",
  messagingSenderId: "1045648281622",
  appId: "1:1045648281622:web:cc0654b08ea73066e2e537",
};

// ✅ Evita inicializar mais de uma vez (Next recarrega muito)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔐 Auth (é o que você REALMENTE precisa agora)
export const auth = getAuth(app);

export default app;
