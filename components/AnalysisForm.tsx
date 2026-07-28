"use client";

import type { FormEvent } from "react";
import type {
  Recipient,
  RecipientCulture,
  Scenario,
  SenderGoal,
} from "@/lib/types";
import {
  RECIPIENT_CULTURE_OPTIONS,
  RECIPIENT_OPTIONS,
  SCENARIO_OPTIONS,
  SENDER_GOAL_OPTIONS,
} from "@/lib/constants";
import { LoadingSpinner } from "./LoadingSpinner";
import { PillOption } from "./PillOption";

interface AnalysisFormProps {
  message: string;
  recipient: Recipient;
  scenario: Scenario;
  recipientCulture: RecipientCulture;
  senderGoal: SenderGoal;
  isLoading: boolean;
  onMessageChange: (value: string) => void;
  onRecipientChange: (value: Recipient) => void;
  onScenarioChange: (value: Scenario) => void;
  onRecipientCultureChange: (value: RecipientCulture) => void;
  onSenderGoalChange: (value: SenderGoal) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const selectClassName =
  "w-full appearance-none rounded-xl border border-stone-200/70 bg-stone-50/40 px-4 py-3 text-sm text-stone-800 outline-none transition-colors focus:border-stone-300 focus:bg-white focus:ring-2 focus:ring-stone-200/60";

export function AnalysisForm({
  message,
  recipient,
  scenario,
  recipientCulture,
  senderGoal,
  isLoading,
  onMessageChange,
  onRecipientChange,
  onScenarioChange,
  onRecipientCultureChange,
  onSenderGoalChange,
  onSubmit,
}: AnalysisFormProps) {
  return (
    <div
      id="consultation-form"
      className="rounded-3xl border border-stone-200/60 bg-white p-6 shadow-sm sm:p-8"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-7">
        <div>
          <label
            htmlFor="message"
            className="mb-3 block text-xs font-medium uppercase tracking-[0.12em] text-stone-400"
          >
            粘贴你的英文草稿
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder='粘贴你不太敢发的那条英文消息…（例如："Can you review this PR? Should be quick — need it merged today."）'
            rows={6}
            required
            className="w-full resize-y rounded-2xl border border-stone-200/70 bg-stone-50/40 px-4 py-4 text-[15px] leading-[1.75] text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-300 focus:bg-white focus:ring-2 focus:ring-stone-200/60"
          />
          <p className="mt-2.5 text-center text-[11px] leading-relaxed text-stone-400">
            你的消息不会被存储，也不会用于训练。分析完即丢弃。
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
                收件人
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
                场景
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="recipient-culture"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-stone-400"
              >
                对方的团队文化
              </label>
              <select
                id="recipient-culture"
                value={recipientCulture}
                onChange={(e) =>
                  onRecipientCultureChange(e.target.value as RecipientCulture)
                }
                className={selectClassName}
              >
                {RECIPIENT_CULTURE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sender-goal"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-stone-400"
              >
                你想要的结果
              </label>
              <select
                id="sender-goal"
                value={senderGoal}
                onChange={(e) =>
                  onSenderGoalChange(e.target.value as SenderGoal)
                }
                className={selectClassName}
              >
                {SENDER_GOAL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
              正在分析…
            </>
          ) : (
            <>
              <span aria-hidden="true">✦</span>
              看看我的消息会被怎么读
            </>
          )}
        </button>
      </form>
    </div>
  );
}
