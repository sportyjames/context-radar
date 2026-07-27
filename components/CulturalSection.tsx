interface CulturalSectionProps {
  explanation: string;
}

export function CulturalSection({ explanation }: CulturalSectionProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium text-stone-800">
        Cultural Subtext &amp; Unwritten Rules
      </h3>
      <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-4 text-stone-800">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-stone-500">
          💡 Executive Coach Insights
        </p>
        <p className="text-[14px] leading-[1.75]">{explanation}</p>
      </div>
    </section>
  );
}
