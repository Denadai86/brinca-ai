"use client";

import { Heart } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { useEffect, useState } from "react";

type Props = {
  isCompact?: boolean;
};

export function SupporterBadge({ isCompact = false }: Props) {
  const { user, loading } = useAuth();
  const [isSupporter, setIsSupporter] = useState(false);

  useEffect(() => {
    if (!user) return;

    const supporter = localStorage.getItem("brincaai_supporter");
    setIsSupporter(supporter === "true");
  }, [user]);

  if (loading || !user || !isSupporter) return null;

  return (
    <div
      className={`flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 text-pink-700 shadow-sm transition-all
        ${isCompact ? "text-xs px-2 py-0.5" : "text-sm"}
      `}
    >
      <Heart className="h-4 w-4 fill-pink-500" />
      {!isCompact && <span className="font-bold">Apoiador</span>}
    </div>
  );
}
