"use client";

import { useMemo } from "react";
import type { AnalysisResult } from "@/lib/types";
import { RiskSection } from "./RiskSection";
import { CulturalSection } from "./CulturalSection";
import { RewritesSection } from "./RewritesSection";
import { FeedbackPrompt } from "./FeedbackPrompt";
import { HighlightedDraft } from "./HighlightedDraft";
import { OnboardingSurvey } from "./OnboardingSurvey";

interface ResultsDisplayProps {
  result: AnalysisResult;
  draft: string;
  generatedAt: Date;
  showSurvey?: boolean;
  onSurveyComplete?: () => void;
}

function formatReportId(date: Date): string {
  const stamp = date.getTime().toString(36).toUpperCase().slice(-5);
  return `CR-${stamp}`;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ResultsDisplay({
  result,
  draft,
  generatedAt,
  showSurvey = false,
  onSurveyComplete,
}: ResultsDisplayProps) {
  const reportId = useMemo(() => formatReportId(generatedAt), [generatedAt]);
  const timestamp = useMemo(() => formatTimestamp(generatedAt), [generatedAt]);

  return (
    <section aria-live="polite" className="mt-10 sm:mt-12">
      <article className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-md sm:p-8">
        <header className="mb-8 border-b border-stone-100 pb-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">
            📋 感知诊断报告
          </p>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-xl font-medium text-stone-800 sm:text-2xl">
              你的消息会被怎么读
            </h2>
            <p className="text-xs text-stone-400">
              {timestamp} · #{reportId}
            </p>
          </div>
        </header>

        <div className="space-y-8">
          <HighlightedDraft draft={draft} flaggedPhrase={result.flaggedPhrase} />
          <RiskSection
            riskLevel={result.riskLevel}
            riskDirection={result.riskDirection}
            perceptionRange={result.perceptionRange}
          />
          <CulturalSection explanation={result.culturalNote} />
          <RewritesSection rewrites={result.rewrites} />
        </div>

        {showSurvey && onSurveyComplete && (
          <div className="mt-8 border-t border-stone-100 pt-8">
            <OnboardingSurvey onComplete={onSurveyComplete} />
          </div>
        )}

        <FeedbackPrompt reportId={reportId} riskLevel={result.riskLevel} />

        <footer className="mt-8 border-t border-stone-100 pt-6 text-center">
          <p className="font-serif text-sm tracking-wide text-stone-400">
            ✨ Context Radar · 职场消息感知实验室
          </p>
        </footer>
      </article>
    </section>
  );
}
