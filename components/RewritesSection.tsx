import type { PersonaRewrite } from "@/lib/types";
import { CopyButton } from "./CopyButton";

interface RewritesSectionProps {
  rewrites: PersonaRewrite[];
}

export function RewritesSection({ rewrites }: RewritesSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-medium text-stone-800">
        Calibrated Alternatives (Rewrites)
      </h3>
      <div className="flex flex-col gap-3">
        {rewrites.map((rewrite) => (
          <div
            key={rewrite.label}
            className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm"
          >
            <div className="mb-2.5 flex items-start justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-800/90">
                {rewrite.label}
              </p>
              <CopyButton text={rewrite.text} />
            </div>
            <p className="text-[14px] leading-[1.75] text-stone-700">
              {rewrite.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
