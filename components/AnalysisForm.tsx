"use client";

import type { FormEvent } from "react";
import type { Recipient, Scenario } from "@/lib/types";
import { RECIPIENT_OPTIONS, SCENARIO_OPTIONS } from "@/lib/constants";
import { LoadingSpinner } from "./LoadingSpinner";

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

const selectClassName =
  "w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800";

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
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="message" className="sr-only">
          Draft message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder='Paste your draft message here... (e.g., "Please fix this ASAP")'
          rows={6}
          required
          className="w-full resize-y rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm leading-relaxed text-zinc-900 shadow-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="recipient"
            className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
          >
            Recipient
          </label>
          <select
            id="recipient"
            value={recipient}
            onChange={(e) => onRecipientChange(e.target.value as Recipient)}
            className={selectClassName}
          >
            {RECIPIENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="scenario"
            className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
          >
            Scenario
          </label>
          <select
            id="scenario"
            value={scenario}
            onChange={(e) => onScenarioChange(e.target.value as Scenario)}
            className={selectClassName}
          >
            {SCENARIO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Analyzing…
          </>
        ) : (
          "Analyze Perception"
        )}
      </button>
    </form>
  );
}
