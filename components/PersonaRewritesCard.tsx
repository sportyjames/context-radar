import type { PersonaRewrite } from "@/lib/types";
import { CopyButton } from "./CopyButton";

interface PersonaRewritesCardProps {
  rewrites: PersonaRewrite[];
}

export function PersonaRewritesCard({ rewrites }: PersonaRewritesCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-5 text-base font-semibold text-zinc-900 dark:text-zinc-50">
        🟢 3 Persona Rewrites
      </h2>
      <div className="flex flex-col gap-4">
        {rewrites.map((rewrite) => (
          <div
            key={rewrite.label}
            className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                {rewrite.label}
              </p>
              <CopyButton text={rewrite.text} />
            </div>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
              {rewrite.text}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
