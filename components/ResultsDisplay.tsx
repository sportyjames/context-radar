import type { AnalysisResult } from "@/lib/types";
import { RiskCard } from "./RiskCard";
import { CulturalDecoderCard } from "./CulturalDecoderCard";
import { PersonaRewritesCard } from "./PersonaRewritesCard";

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <section
      aria-live="polite"
      className="flex flex-col gap-5 border-t border-zinc-200 pt-8 dark:border-zinc-800"
    >
      <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
        Analysis Results
      </h2>
      <RiskCard
        riskLevel={result.riskLevel}
        riskSummary={result.riskSummary}
        recipientFeeling={result.recipientFeeling}
      />
      <CulturalDecoderCard explanation={result.culturalExplanation} />
      <PersonaRewritesCard rewrites={result.rewrites} />
    </section>
  );
}
