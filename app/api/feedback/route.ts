import { NextResponse } from "next/server";
import type { Recipient, Scenario } from "@/lib/types";

interface FeedbackBody {
  helpful?: boolean;
  reportId?: string;
  recipient?: Recipient;
  scenario?: Scenario;
}

const VALID_RECIPIENTS: Recipient[] = [
  "manager",
  "peer",
  "cross-functional",
  "direct-report",
];

const VALID_SCENARIOS: Scenario[] = [
  "update-urgency",
  "disagreement",
  "asking-help",
  "small-talk",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FeedbackBody;

    if (typeof body.helpful !== "boolean") {
      return NextResponse.json({ error: "helpful is required." }, { status: 400 });
    }

    if (!body.reportId?.trim()) {
      return NextResponse.json({ error: "reportId is required." }, { status: 400 });
    }

    if (!body.recipient || !VALID_RECIPIENTS.includes(body.recipient)) {
      return NextResponse.json({ error: "Invalid recipient." }, { status: 400 });
    }

    if (!body.scenario || !VALID_SCENARIOS.includes(body.scenario)) {
      return NextResponse.json({ error: "Invalid scenario." }, { status: 400 });
    }

    const entry = {
      helpful: body.helpful,
      reportId: body.reportId.trim(),
      recipient: body.recipient,
      scenario: body.scenario,
      submittedAt: new Date().toISOString(),
    };

    console.info("[Context Radar Feedback]", JSON.stringify(entry));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to record feedback." }, { status: 500 });
  }
}
