import type { RiskLevel } from "@/lib/types";

interface RiskCardProps {
  riskLevel: RiskLevel;
  riskSummary: string;
  recipientFeeling: string;
}

const RISK_STYLES: Record<
  RiskLevel,
  { badge: string; ring: string; label: string }
> = {
  Low: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    ring: "ring-emerald-200/60 dark:ring-emerald-900/60",
    label: "Low Risk",
  },
  Medium: {
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    ring: "ring-amber-200/60 dark:ring-amber-900/60",
    label: "Medium Risk",
  },
  High: {
    badge: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    ring: "ring-red-200/60 dark:ring-red-900/60",
    label: "High Risk",
  },
};

export function RiskCard({ riskLevel, riskSummary, recipientFeeling }: RiskCardProps) {
  const styles = RISK_STYLES[riskLevel];

  return (
    <article
      className={`rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm ring-1 ${styles.ring} dark:border-zinc-800 dark:bg-zinc-900`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          🔴 Social Perception Risk &amp; Warning
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles.badge}`}
        >
          {styles.label}
        </span>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {riskSummary}
      </p>
      <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950/60">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
          What they might secretly feel
        </p>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
          {recipientFeeling}
        </p>
      </div>
    </article>
  );
}
