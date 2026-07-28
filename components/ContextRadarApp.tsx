"use client";

import { useState, type FormEvent } from "react";
import type {
  AnalysisResult,
  DiagnoseApiResponse,
  Recipient,
  RecipientCulture,
  Scenario,
  SenderGoal,
} from "@/lib/types";
import { mapDiagnoseToAnalysisResult } from "@/lib/map-diagnose";
import { Header } from "./Header";
import { StaticExample } from "./StaticExample";
import { AnalysisForm } from "./AnalysisForm";
import { ResultsDisplay } from "./ResultsDisplay";
import { isSurveyPending } from "./OnboardingSurvey";

export function ContextRadarApp() {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState<Recipient>("manager");
  const [scenario, setScenario] = useState<Scenario>("update-urgency");
  const [recipientCulture, setRecipientCulture] =
    useState<RecipientCulture>("us");
  const [senderGoal, setSenderGoal] = useState<SenderGoal>("speed");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [submittedDraft, setSubmittedDraft] = useState("");
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const draft = message.trim();

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft,
          recipient,
          scenario,
          recipient_culture: recipientCulture,
          sender_goal: senderGoal,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "分析失败，请稍后再试。");
      }

      const data = (await response.json()) as DiagnoseApiResponse;
      setResult(mapDiagnoseToAnalysisResult(data));
      setSubmittedDraft(draft);
      setGeneratedAt(new Date());

      if (isSurveyPending()) {
        setShowSurvey(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "出了点问题，请稍后再试。");
      setResult(null);
      setSubmittedDraft("");
      setGeneratedAt(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[#f7f5f2]">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-16 pt-2 sm:px-6">
        <StaticExample />
        <AnalysisForm
          message={message}
          recipient={recipient}
          scenario={scenario}
          recipientCulture={recipientCulture}
          senderGoal={senderGoal}
          isLoading={isLoading}
          onMessageChange={setMessage}
          onRecipientChange={setRecipient}
          onScenarioChange={setScenario}
          onRecipientCultureChange={setRecipientCulture}
          onSenderGoalChange={setSenderGoal}
          onSubmit={handleSubmit}
        />

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm leading-relaxed text-rose-800"
          >
            {error}
          </p>
        )}

        {result && generatedAt && (
          <ResultsDisplay
            result={result}
            draft={submittedDraft}
            generatedAt={generatedAt}
            showSurvey={showSurvey}
            onSurveyComplete={() => setShowSurvey(false)}
          />
        )}
      </main>
    </div>
  );
}
