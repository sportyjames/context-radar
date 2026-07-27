import type { RiskLevel } from "@/lib/types";

interface RiskSectionProps {
  riskLevel: RiskLevel;
  riskSummary: string;
  recipientFeeling: string;
}

const RISK_LABELS: Record<RiskLevel, string> = {
  Low: "Low Risk",
  Medium: "Medium Risk",
  High: "High Risk",
};

const RISK_BADGE: Record<RiskLevel, string> = {
  Low: "bg-emerald-100/80 text-emerald-800",
  Medium: "bg-amber-100/80 text-amber-800",
  High: "bg-rose-200/60 text-rose-900",
};

export function RiskSection({
  riskLevel,
  riskSummary,
  recipientFeeling,
}: RiskSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-stone-800">
          Subtext &amp; Perception Risk
        </h3>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${RISK_BADGE[riskLevel]}`}
        >
          {RISK_LABELS[riskLevel]}
        </span>
      </div>
      <p className="text-[14px] leading-relaxed text-stone-600">{riskSummary}</p>
      <div className="rounded-2xl border border-rose-200/60 bg-rose-50/60 p-4 text-rose-900">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-rose-700/80">
          🔴 What They Might Secretly Feel
        </p>
        <p className="text-[14px] leading-[1.75]">{recipientFeeling}</p>
      </div>
    </section>
  );
}
