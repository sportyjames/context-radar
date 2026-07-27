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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
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
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
          >
            {error}
          </p>
        )}

        {result && (
          <div className="mt-10">
            <ResultsDisplay result={result} />
          </div>
        )}
      </main>
    </div>
  );
}
