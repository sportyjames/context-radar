import { NextResponse } from "next/server";
import type { Recipient, Scenario } from "@/lib/types";
import {
  RECIPIENT_OPTIONS,
  SCENARIO_OPTIONS,
} from "@/lib/constants";
import { callDiagnoseLLM } from "@/lib/diagnose";

const SYSTEM_PROMPT = `You are an exceptionally sharp, perceptive Silicon Valley Executive Coach and expert in US cross-cultural workplace dynamics.

Your task: Decode the HIDDEN social signals and subtext in the user's draft message. Non-native professionals often write messages that sound technically fine, but trigger unintended defensive or negative reactions in US tech/corporate culture.

DO NOT just compliment or fix grammar. Be candid, psychologically acute, and culturally precise.

Analyze the draft considering the provided Recipient and Scenario.

Return ONLY a JSON object with this exact structure:

{
  "risk_level": "High" | "Medium" | "Low",
  "perception_warning": "What is the EXACT internal dialogue running through the recipient's head when they read this? Frame it as their inner monologue starting with 'They think: ...'. Be 100% candid, realistic, and psychologically accurate in 1-2 sharp sentences.",
  "cultural_decoder": "Explain the UNWRITTEN US workplace rule or psychological dynamic being broken or played here. Why does this specific framing trigger that reaction? Provide 2-3 deep, actionable sentences.",
  "rewrites": {
    "collaborative": "Focus on team impact and low-pressure alignment.",
    "assertive": "Demonstrate proactive ownership—propose a solution or next priority instead of passively waiting for orders.",
    "diplomatic": "Tactful, highly polished for senior leadership or delicate contexts."
  }
}`;

interface DiagnoseBody {
  draft?: string;
  recipient?: Recipient;
  scenario?: Scenario;
}

function getLabel<T extends { value: string; label: string }>(
  options: T[],
  value: string
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function buildUserPrompt(
  draft: string,
  recipient: Recipient,
  scenario: Scenario
): string {
  const recipientLabel = getLabel(RECIPIENT_OPTIONS, recipient);
  const scenarioLabel = getLabel(SCENARIO_OPTIONS, scenario);

  return [
    "Analyze this workplace message draft.",
    "",
    `Recipient: ${recipientLabel}`,
    `Scenario: ${scenarioLabel}`,
    "",
    "Draft:",
    draft,
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DiagnoseBody;

    if (!body.draft?.trim()) {
      return NextResponse.json({ error: "Draft is required." }, { status: 400 });
    }

    if (!body.recipient || !body.scenario) {
      return NextResponse.json(
        { error: "Recipient and scenario are required." },
        { status: 400 }
      );
    }

    const userPrompt = buildUserPrompt(
      body.draft.trim(),
      body.recipient,
      body.scenario
    );

    const result = await callDiagnoseLLM(userPrompt, SYSTEM_PROMPT);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to diagnose message.";

    const status = message.includes("API key") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
