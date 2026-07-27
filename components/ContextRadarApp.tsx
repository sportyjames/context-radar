"use client";

import { useState, type FormEvent } from "react";
import type { AnalysisResult, DiagnoseApiResponse, Recipient, Scenario } from "@/lib/types";
import { mapDiagnoseToAnalysisResult } from "@/lib/map-diagnose";
import { Header } from "./Header";
import { AnalysisForm } from "./AnalysisForm";
import { ResultsDisplay } from "./ResultsDisplay";

export function ContextRadarApp() {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState<Recipient>("manager");
  const [scenario, setScenario] = useState<Scenario>("update-urgency");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: message, recipient, scenario }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Analysis failed.");
      }

      const data = (await response.json()) as DiagnoseApiResponse;
      setResult(mapDiagnoseToAnalysisResult(data));
      setGeneratedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setResult(null);
      setGeneratedAt(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[#f7f5f2]">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-16 pt-2 sm:px-6">
        <AnalysisForm
          message={message}
          recipient={recipient}
          scenario={scenario}
          isLoading={isLoading}
          onMessageChange={setMessage}
          onRecipientChange={setRecipient}
          onScenarioChange={setScenario}
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
            generatedAt={generatedAt}
            recipient={recipient}
            scenario={scenario}
          />
        )}
      </main>
    </div>
  );
}
