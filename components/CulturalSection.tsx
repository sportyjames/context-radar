interface CulturalSectionProps {
  explanation: string;
}

export function CulturalSection({ explanation }: CulturalSectionProps) {
  if (!explanation.trim()) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium text-stone-800">文化潜台词</h3>
      <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-4 text-stone-800">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-stone-500">
          💡 未写明的规则
        </p>
        <p className="text-[15px] leading-[1.85] tracking-wide [text-wrap:pretty]">
          {explanation}
        </p>
      </div>
    </section>
  );
}
