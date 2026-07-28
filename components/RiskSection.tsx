import type { RiskDirection, RiskLevel } from "@/lib/types";

interface RiskSectionProps {
  riskLevel: RiskLevel;
  riskDirection: RiskDirection;
  perceptionRange: string;
}

const RISK_LABELS: Record<RiskLevel, string> = {
  Low: "低风险",
  Medium: "中等",
  High: "高风险",
};

const RISK_BADGE: Record<RiskLevel, string> = {
  Low: "bg-emerald-100/80 text-emerald-800",
  Medium: "bg-amber-100/80 text-amber-800",
  High: "bg-rose-200/60 text-rose-900",
};

const DIRECTION_LABELS: Record<Exclude<RiskDirection, "none">, string> = {
  too_blunt: "太直接",
  too_soft: "太软，容易被忽略",
  wrong_register: "像公文，不像人说话",
};

const DIRECTION_BADGE: Record<Exclude<RiskDirection, "none">, string> = {
  too_blunt: "border-stone-200 bg-white text-stone-600",
  too_soft: "border-stone-200 bg-white text-stone-600",
  wrong_register: "border-stone-200/80 bg-stone-100/80 text-stone-600",
};

const PERCEPTION_LABELS: Record<RiskDirection, string> = {
  none: "✓ 读法范围",
  too_blunt: "敏感读者 vs 典型读者",
  too_soft: "即时后果 vs 累积印象",
  wrong_register: "当下察觉 vs 长期印象",
};

const CONTAINER_STYLES: Record<RiskLevel, string> = {
  Low: "border-emerald-200/60 bg-emerald-50/50 text-emerald-900",
  Medium: "border-amber-200/60 bg-amber-50/50 text-amber-950",
  High: "border-rose-200/60 bg-rose-50/60 text-rose-900",
};

const REGISTER_CONTAINER =
  "border-stone-200/70 bg-stone-50/70 text-stone-800";

export function RiskSection({
  riskLevel,
  riskDirection,
  perceptionRange,
}: RiskSectionProps) {
  const directionLabel =
    riskDirection !== "none" ? DIRECTION_LABELS[riskDirection] : null;
  const isAllClear = riskDirection === "none" && riskLevel === "Low";
  const isWrongRegister = riskDirection === "wrong_register";

  const containerClass = isWrongRegister
    ? REGISTER_CONTAINER
    : CONTAINER_STYLES[riskLevel];

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-medium text-stone-800">对方会怎么读</h3>
        {isAllClear ? (
          <span className="rounded-full bg-emerald-100/80 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">
            这条没问题
          </span>
        ) : isWrongRegister ? (
          <span className="rounded-full border border-stone-200/80 bg-stone-100/80 px-2.5 py-1 text-[10px] font-medium text-stone-600">
            语域偏差
          </span>
        ) : (
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${RISK_BADGE[riskLevel]}`}
          >
            {RISK_LABELS[riskLevel]}
          </span>
        )}
        {directionLabel && riskDirection !== "none" && (
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${DIRECTION_BADGE[riskDirection]}`}
          >
            {directionLabel}
          </span>
        )}
      </div>

      <div className={`rounded-2xl border p-4 ${containerClass}`}>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] opacity-80">
          {PERCEPTION_LABELS[riskDirection]}
        </p>
        <p className="text-[15px] leading-[1.85] tracking-wide [text-wrap:pretty]">
          {perceptionRange}
        </p>
      </div>
    </section>
  );
}
