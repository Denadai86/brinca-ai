"use client";

import { InstagramGenerator } from "@/components/InstagramGenerator";
import type { GeneratedActivity } from "@/lib/activity-format";

interface GeneratedActivityCardProps {
  activity: GeneratedActivity;
  tema: string;
  target: string;
  index: number;
}

export function GeneratedActivityCard({
  activity,
  tema,
  target,
  index,
}: GeneratedActivityCardProps) {
  return (
    <article className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-purple-600">
          Atividade Gerada #{index + 1}
        </span>
      </div>

      <h4 className="text-xl font-bold text-slate-800">{activity.titulo}</h4>

      <p className="bg-yellow-50 p-3 rounded-xl border-l-4 border-yellow-400 italic text-slate-700 text-sm">
        {activity.motivacional}
      </p>

      {/* Antes, as tags eram apagadas e os títulos das seções sumiam do resultado. */}
      <section className="space-y-2">
        <h5 className="text-sm font-bold text-slate-800">Materiais necessários</h5>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
          {activity.materiais.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h5 className="text-sm font-bold text-slate-800">Objetivo pedagógico</h5>
        <p className="text-sm text-slate-600">{activity.pedagogico}</p>
      </section>

      <section className="space-y-2">
        <h5 className="text-sm font-bold text-slate-800">Passo a passo</h5>
        <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-600">
          {activity.passos.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ol>
      </section>

      <div className="pt-4 border-t border-slate-100 flex justify-end w-full sm:w-auto">
        <div className="w-32">
          <InstagramGenerator
            activity={{ tema, target, content: activity.content }}
          />
        </div>
      </div>
    </article>
  );
}
