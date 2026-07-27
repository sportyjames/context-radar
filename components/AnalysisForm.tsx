"use client";

import type { FormEvent } from "react";
import type { Recipient, Scenario } from "@/lib/types";
import { RECIPIENT_OPTIONS, SCENARIO_OPTIONS } from "@/lib/constants";
import { LoadingSpinner } from "./LoadingSpinner";
import { PillOption } from "./PillOption";

interface AnalysisFormProps {
  message: string;
  recipient: Recipient;
  scenario: Scenario;
  isLoading: boolean;
  onMessageChange: (value: string) => void;
  onRecipientChange: (value: Recipient) => void;
  onScenarioChange: (value: Scenario) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function AnalysisForm({
  message,
  recipient,
  scenario,
  isLoading,
  onMessageChange,
  onRecipientChange,
  onScenarioChange,
  onSubmit,
}: AnalysisFormProps) {
  return (
    <div className="rounded-3xl border border-stone-200/60 bg-white p-6 shadow-sm sm:p-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-7">
        <div>
          <label
            htmlFor="message"
            className="mb-3 block text-xs font-medium uppercase tracking-[0.12em] text-stone-400"
          >
            Your Draft Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={`Paste the draft you're hesitant to send... (e.g., "Can you review this PR? Should be a quick fix — need it merged today, blocking my sprint.")`}
            rows={6}
            required
            className="w-full resize-y rounded-2xl border border-stone-200/70 bg-stone-50/40 px-4 py-4 text-[15px] leading-[1.75] text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-300 focus:bg-white focus:ring-2 focus:ring-stone-200/60"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
              Recipient
            </p>
            <div className="flex flex-wrap gap-2">
              {RECIPIENT_OPTIONS.map((option) => (
                <PillOption
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  selected={recipient === option.value}
                  onSelect={onRecipientChange}
                  variant="slate"
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
              Scenario
            </p>
            <div className="flex flex-wrap gap-2">
              {SCENARIO_OPTIONS.map((option) => (
                <PillOption
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  selected={scenario === option.value}
                  onSelect={onScenarioChange}
                  variant="sage"
                />
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-stone-800 px-6 py-4 text-sm font-medium tracking-wide text-stone-50 transition-all hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Diagnosing your message…
            </>
          ) : (
            <>
              <span aria-hidden="true">✦</span>
              Start Communication Diagnosis
            </>
          )}
        </button>
      </form>
    </div>
  );
}
