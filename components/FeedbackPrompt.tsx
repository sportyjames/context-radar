"use client";

import { useState } from "react";
import type { FeedbackRating, RiskLevel } from "@/lib/types";

interface FeedbackPromptProps {
  reportId: string;
  riskLevel: RiskLevel;
}

const THANK_YOU: Record<FeedbackRating, string> = {
  spot_on: "收到，谢谢你的反馈。",
  not_enough: "收到，我们会继续校准。",
  overinterpreted: "收到，这条反馈很有价值。",
};

export function FeedbackPrompt({ reportId, riskLevel }: FeedbackPromptProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [selection, setSelection] = useState<FeedbackRating | null>(null);

  async function submitFeedback(rating: FeedbackRating) {
    if (status !== "idle") return;

    setStatus("submitting");
    setSelection(rating);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, reportId, riskLevel }),
      });
    } catch {
      // Best-effort for MVP
    } finally {
      setStatus("done");
    }
  }

  return (
    <div className="border-t border-stone-100 pt-6">
      {status === "done" && selection ? (
        <p className="text-center text-xs text-stone-500">
          {THANK_YOU[selection]}
        </p>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-stone-500">这次分析准吗？</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              disabled={status === "submitting"}
              onClick={() => submitFeedback("spot_on")}
              className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-50 disabled:opacity-50"
            >
              说得对
            </button>
            <button
              type="button"
              disabled={status === "submitting"}
              onClick={() => submitFeedback("not_enough")}
              className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-50 disabled:opacity-50"
            >
              还不够
            </button>
            <button
              type="button"
              disabled={status === "submitting"}
              onClick={() => submitFeedback("overinterpreted")}
              className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-50 disabled:opacity-50"
            >
              过度解读了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
