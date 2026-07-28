import type { PersonaRewrite } from "@/lib/types";
import { CopyButton } from "./CopyButton";

interface RewritesSectionProps {
  rewrites: PersonaRewrite[];
}

const REWRITE_DESCRIPTIONS: Record<PersonaRewrite["label"], string> = {
  走关系: "共同目标 · 协作关系",
  摆事实: "依赖关系 · 具体影响",
  留记录: "清晰 · 中性 · 可追溯",
};

export function RewritesSection({ rewrites }: RewritesSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-stone-800">三种改写策略</h3>
        <p className="mt-1 text-xs leading-relaxed text-stone-500">
          诉求不变，路径不同 — 同样力度，三种走法。
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {rewrites.map((rewrite) => (
          <div
            key={rewrite.label}
            className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm"
          >
            <div className="mb-2.5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-800/90">
                  {rewrite.label}
                </p>
                <p className="mt-0.5 text-[11px] text-stone-500">
                  {REWRITE_DESCRIPTIONS[rewrite.label]}
                </p>
              </div>
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
