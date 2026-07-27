"use client";

import { useState } from "react";
import type { Recipient, Scenario } from "@/lib/types";

interface FeedbackPromptProps {
  reportId: string;
  recipient: Recipient;
  scenario: Scenario;
}

export function FeedbackPrompt({
  reportId,
  recipient,
  scenario,
}: FeedbackPromptProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [selection, setSelection] = useState<"helpful" | "not-helpful" | null>(
    null
  );

  async function submitFeedback(helpful: boolean) {
    if (status !== "idle") return;

    setStatus("submitting");
    setSelection(helpful ? "helpful" : "not-helpful");

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          helpful,
          reportId,
          recipient,
          scenario,
        }),
      });
    } catch {
      // Still acknowledge — feedback is best-effort for MVP
    } finally {
      setStatus("done");
    }
  }

  return (
    <div className="border-t border-stone-100 pt-6">
      {status === "done" ? (
        <p className="text-center text-xs text-stone-500">
          {selection === "helpful"
            ? "Glad this resonated — thank you."
            : "Thanks — we'll keep calibrating."}
        </p>
      ) : (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <p className="text-xs text-stone-500">Was this diagnosis helpful?</p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={status === "submitting"}
              onClick={() => submitFeedback(true)}
              className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-50 disabled:opacity-50"
            >
              👍 Spot on
            </button>
            <button
              type="button"
              disabled={status === "submitting"}
              onClick={() => submitFeedback(false)}
              className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-50 disabled:opacity-50"
            >
              👎 Not quite
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
