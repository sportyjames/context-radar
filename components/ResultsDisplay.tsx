"use client";

import { useMemo } from "react";
import type { AnalysisResult, Recipient, Scenario } from "@/lib/types";
import { RiskSection } from "./RiskSection";
import { CulturalSection } from "./CulturalSection";
import { RewritesSection } from "./RewritesSection";
import { FeedbackPrompt } from "./FeedbackPrompt";

interface ResultsDisplayProps {
  result: AnalysisResult;
  generatedAt: Date;
  recipient: Recipient;
  scenario: Scenario;
}

function formatReportId(date: Date): string {
  const stamp = date.getTime().toString(36).toUpperCase().slice(-5);
  return `CR-${stamp}`;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ResultsDisplay({
  result,
  generatedAt,
  recipient,
  scenario,
}: ResultsDisplayProps) {
  const reportId = useMemo(() => formatReportId(generatedAt), [generatedAt]);
  const timestamp = useMemo(() => formatTimestamp(generatedAt), [generatedAt]);

  return (
    <section aria-live="polite" className="mt-10 sm:mt-12">
      <article className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-md sm:p-8">
        <header className="mb-8 border-b border-stone-100 pb-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">
            📋 Perception Diagnosis Report
          </p>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-xl font-medium text-stone-800 sm:text-2xl">
              Your Communication Diagnosis
            </h2>
            <p className="text-xs text-stone-400">
              {timestamp} · Report #{reportId}
            </p>
          </div>
        </header>

        <div className="space-y-8">
          <RiskSection
            riskLevel={result.riskLevel}
            riskSummary={result.riskSummary}
            recipientFeeling={result.recipientFeeling}
          />
          <CulturalSection explanation={result.culturalExplanation} />
          <RewritesSection rewrites={result.rewrites} />
        </div>

        <FeedbackPrompt
          reportId={reportId}
          recipient={recipient}
          scenario={scenario}
        />

        <footer className="mt-8 border-t border-stone-100 pt-6 text-center">
          <p className="font-serif text-sm tracking-wide text-stone-400">
            ✨ Context Radar · Workplace Social Perception Lab
          </p>
        </footer>
      </article>
    </section>
  );
}
