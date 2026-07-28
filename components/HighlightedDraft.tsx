import { highlightPhrase } from "@/lib/highlight-phrase";

interface HighlightedDraftProps {
  draft: string;
  flaggedPhrase: string;
}

export function HighlightedDraft({ draft, flaggedPhrase }: HighlightedDraftProps) {
  return (
    <section className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-stone-400">
        你的原文
      </p>
      <div className="rounded-2xl border border-stone-200/70 bg-stone-50/50 px-4 py-3.5 text-[14px] leading-[1.75] text-stone-800">
        {highlightPhrase(draft, flaggedPhrase)}
      </div>
    </section>
  );
}
