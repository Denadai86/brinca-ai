// src/auth/AuthProvider.tsx
"use client";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth, db } from "@/lib/firebase";

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isSupporter: boolean;
  createdAt: Timestamp;
  lastLogin: Timestamp;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>; // Útil para pós-pagamento
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar ou criar perfil no Firestore
  const syncProfile = useCallback(async (firebaseUser: User) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        // Atualiza apenas o lastLogin para auditoria
        await updateDoc(userRef, { lastLogin: Timestamp.now() });
        setProfile({ ...data, lastLogin: Timestamp.now() });
      } else {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isSupporter: false,
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now(),
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error("Erro ao sincronizar perfil:", error);
    }
  }, []);

  // Listener principal de Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); // Inicia loading ao mudar estado
      
      if (firebaseUser) {
        setUser(firebaseUser);
        await syncProfile(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncProfile]);

  // Função para atualizar os dados do usuário sob demanda
  const refreshProfile = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setProfile(userSnap.data() as UserProfile);
    }
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" }); // Força escolher conta
    try {
      // O login dispara o onAuthStateChanged, que por sua vez chama o syncProfile
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Erro na operação de login:", error.code);
      throw error; // Lança para o componente (ex: Header) tratar o loading
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      setUser(null);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      login, 
      logout,
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}