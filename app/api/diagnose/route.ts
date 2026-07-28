import { NextResponse } from "next/server";
import type {
  Recipient,
  RecipientCulture,
  Scenario,
  SenderGoal,
} from "@/lib/types";
import {
  getOptionLabel,
  RECIPIENT_CULTURE_OPTIONS,
  RECIPIENT_OPTIONS,
  SCENARIO_OPTIONS,
  SENDER_GOAL_OPTIONS,
} from "@/lib/constants";
import { callDiagnoseLLM } from "@/lib/diagnose";
import { buildSystemPrompt } from "@/lib/system-prompt";

interface DiagnoseBody {
  draft?: string;
  recipient?: Recipient;
  scenario?: Scenario;
  recipient_culture?: RecipientCulture;
  sender_goal?: SenderGoal;
}

const VALID_CULTURES: RecipientCulture[] = [
  "us",
  "uk",
  "europe",
  "china",
  "japan-korea",
  "global-mixed",
];

const VALID_GOALS: SenderGoal[] = [
  "speed",
  "relationship",
  "on-record",
  "probe",
];

function buildUserPrompt(draft: string): string {
  return ["Draft message:", draft].join("\n");
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

    if (
      !body.recipient_culture ||
      !VALID_CULTURES.includes(body.recipient_culture)
    ) {
      return NextResponse.json(
        { error: "Recipient culture is required." },
        { status: 400 }
      );
    }

    if (!body.sender_goal || !VALID_GOALS.includes(body.sender_goal)) {
      return NextResponse.json(
        { error: "Sender goal is required." },
        { status: 400 }
      );
    }

    const recipientLabel = getOptionLabel(RECIPIENT_OPTIONS, body.recipient);
    const scenarioLabel = getOptionLabel(SCENARIO_OPTIONS, body.scenario);
    const cultureLabel = getOptionLabel(
      RECIPIENT_CULTURE_OPTIONS,
      body.recipient_culture
    );
    const goalLabel = getOptionLabel(SENDER_GOAL_OPTIONS, body.sender_goal);

    const systemPrompt = buildSystemPrompt({
      recipient: recipientLabel,
      scenario: scenarioLabel,
      recipientCulture: cultureLabel,
      senderGoal: goalLabel,
    });

    const userPrompt = buildUserPrompt(body.draft.trim());
    const result = await callDiagnoseLLM(userPrompt, systemPrompt);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to diagnose message.";

    const status = message.includes("API key") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
