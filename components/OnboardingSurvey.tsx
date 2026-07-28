"use client";

import { useState } from "react";
import type { SurveyPainPoint, SurveyPrimaryGoal } from "@/lib/types";

const SURVEY_STORAGE_KEY = "context-radar-survey-done";

interface OnboardingSurveyProps {
  onComplete: () => void;
}

export function OnboardingSurvey({ onComplete }: OnboardingSurveyProps) {
  const [primaryGoal, setPrimaryGoal] = useState<SurveyPrimaryGoal | null>(
    null
  );
  const [painPoint, setPainPoint] = useState<SurveyPainPoint | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  function dismiss() {
    localStorage.setItem(SURVEY_STORAGE_KEY, "dismissed");
    onComplete();
  }

  async function handleSubmit() {
    if (!primaryGoal || !painPoint || status === "submitting") return;

    setStatus("submitting");

    try {
      await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primaryGoal, painPoint }),
      });
    } catch {
      // Best-effort
    } finally {
      localStorage.setItem(SURVEY_STORAGE_KEY, "completed");
      onComplete();
    }
  }

  const q1Options: { value: SurveyPrimaryGoal; label: string }[] = [
    { value: "read-my-writing", label: "看看我写的东西会被怎么读" },
    { value: "read-incoming", label: "看懂别人发给我的话到底什么意思" },
    { value: "both", label: "两个都想要" },
  ];

  const q2Options: { value: SurveyPainPoint; label: string }[] = [
    { value: "workplace-formal", label: "跟老板/同事的正事沟通" },
    { value: "interview-prep", label: "面试准备（BQ / 行为面试）" },
    { value: "workplace-casual", label: "同事之间的闲聊、玩笑、社交邀约" },
    { value: "social-outside-work", label: "工作之外的社交（微信群、约会、社区）" },
  ];

  return (
    <section className="rounded-2xl border border-stone-200/70 bg-stone-50/40 p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-stone-400">
            快速问卷 · 仅显示一次
          </p>
          <h3 className="mt-1 font-serif text-lg text-stone-800">
            帮我们了解你的需求
          </h3>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-xs text-stone-400 transition-colors hover:text-stone-600"
          aria-label="关闭问卷"
        >
          跳过
        </button>
      </div>

      <div className="space-y-6">
        <fieldset>
          <legend className="mb-3 text-sm text-stone-700">
            Q1. 你最想让它帮你做什么？
          </legend>
          <div className="space-y-2">
            {q1Options.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-sm transition-colors ${
                  primaryGoal === option.value
                    ? "border-stone-800 bg-stone-50 text-stone-900"
                    : "border-stone-200/70 text-stone-600 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="primary-goal"
                  value={option.value}
                  checked={primaryGoal === option.value}
                  onChange={() => setPrimaryGoal(option.value)}
                  className="mt-0.5"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm text-stone-700">
            Q2. 你最头疼的是哪种场景？
          </legend>
          <div className="space-y-2">
            {q2Options.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-sm transition-colors ${
                  painPoint === option.value
                    ? "border-stone-800 bg-stone-50 text-stone-900"
                    : "border-stone-200/70 text-stone-600 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="pain-point"
                  value={option.value}
                  checked={painPoint === option.value}
                  onChange={() => setPainPoint(option.value)}
                  className="mt-0.5"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          disabled={!primaryGoal || !painPoint || status === "submitting"}
          onClick={handleSubmit}
          className="w-full rounded-2xl bg-stone-800 py-3 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {status === "submitting" ? "提交中…" : "提交"}
        </button>
      </div>
    </section>
  );
}

export function isSurveyPending(): boolean {
  if (typeof window === "undefined") return false;
  return !localStorage.getItem(SURVEY_STORAGE_KEY);
}
