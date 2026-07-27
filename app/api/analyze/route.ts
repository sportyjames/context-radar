import { NextResponse } from "next/server";
import type {
  AnalysisRequest,
  AnalysisResult,
  PersonaRewrite,
  RiskLevel,
} from "@/lib/types";
import { RECIPIENT_LABELS } from "@/lib/constants";

function detectRiskLevel(message: string, scenario: AnalysisRequest["scenario"]): RiskLevel {
  const lower = message.toLowerCase();
  const urgencySignals = ["asap", "urgent", "immediately", "now", "fix this", "why haven't"];
  const bluntSignals = ["you need to", "this is wrong", "unacceptable", "disappointed"];

  const urgencyHits = urgencySignals.filter((s) => lower.includes(s)).length;
  const bluntHits = bluntSignals.filter((s) => lower.includes(s)).length;

  if (scenario === "disagreement" || bluntHits >= 1) return "High";
  if (scenario === "update-urgency" && urgencyHits >= 1) return "Medium";
  if (urgencyHits >= 2) return "High";
  if (urgencyHits >= 1) return "Medium";
  return "Low";
}

function buildAnalysis(body: AnalysisRequest): AnalysisResult {
  const { draft, recipient, scenario } = body;
  const recipientLabel = RECIPIENT_LABELS[recipient];
  const riskLevel = detectRiskLevel(draft, scenario);
  const trimmed = draft.trim();

  const riskSummaries: Record<RiskLevel, string> = {
    Low: "Your tone reads as generally appropriate, with minor room to add warmth or context.",
    Medium:
      "Some phrasing may come across as more demanding or abrupt than you intend—especially without relationship context.",
    High:
      "This message carries a strong directive or emotional charge that could trigger defensiveness or resentment.",
  };

  const feelingsByScenario: Record<AnalysisRequest["scenario"], string> = {
    "update-urgency": `They may feel pressured or micromanaged, wondering if you trust their timeline or priorities.`,
    disagreement: `They may feel personally challenged or that their judgment is being questioned in public or private.`,
    "asking-help": `They may feel you're dumping work on them, or that you haven't tried to solve it yourself first.`,
    "small-talk": `They may find the message oddly formal or out of place if the tone doesn't match your usual rapport.`,
  };

  const culturalByScenario: Record<AnalysisRequest["scenario"], string> = {
    "update-urgency": `In US/Western workplaces, urgency without context often signals blame rather than collaboration. Phrases like "ASAP" imply the recipient has failed to prioritize correctly. Adding a reason ("for the client demo") and acknowledging their workload preserves psychological safety.`,
    disagreement: `Direct disagreement can be valued in some teams, but without a "disagree and commit" frame, it reads as criticism. Western norms favor separating ideas from identity—use "I see it differently because…" rather than "This is wrong."`,
    "asking-help": `Asking for help is encouraged, but the framing matters. Without showing what you've tried, recipients may assume you're outsourcing accountability. A brief "I've checked X and Y" signals respect for their time.`,
    "small-talk": `Casual rapport builds trust, but mismatched formality can feel performative. Mirror the channel (Slack vs email) and keep small talk brief before any ask.`,
  };

  const rewrites: PersonaRewrite[] = [
    {
      label: "Collaborative",
      text: buildCollaborativeRewrite(trimmed, recipientLabel, scenario),
    },
    {
      label: "Assertive & Clear",
      text: buildAssertiveRewrite(trimmed, recipientLabel, scenario),
    },
    {
      label: "Diplomatic / Softened",
      text: buildDiplomaticRewrite(trimmed, recipientLabel, scenario),
    },
  ];

  return {
    riskLevel,
    riskSummary: riskSummaries[riskLevel],
    recipientFeeling: feelingsByScenario[scenario].replace("They", `${recipientLabel.charAt(0).toUpperCase()}${recipientLabel.slice(1)} may`),
    culturalExplanation: culturalByScenario[scenario],
    rewrites,
  };
}

function buildCollaborativeRewrite(
  message: string,
  recipient: string,
  scenario: AnalysisRequest["scenario"]
): string {
  if (scenario === "update-urgency") {
    return `Hi — when you have a moment, could you share a quick update on this? I'm trying to align timelines on my end and want to make sure we're synced. No rush if you're heads-down on something else.`;
  }
  if (scenario === "disagreement") {
    return `I might be seeing this from a different angle. Here's my concern: [brief point]. Curious how you're thinking about it — happy to find a path that works for both of us.`;
  }
  if (scenario === "asking-help") {
    return `I'm stuck on something and thought you might have insight. I've tried [X] so far. Would you have 10 minutes to point me in the right direction?`;
  }
  return `Hope your week's going well! ${message ? `Re: "${message.slice(0, 60)}${message.length > 60 ? "…" : ""}" — ` : ""}Just wanted to check in when you have a sec.`;
}

function buildAssertiveRewrite(
  message: string,
  recipient: string,
  scenario: AnalysisRequest["scenario"]
): string {
  if (scenario === "update-urgency") {
    return `Could I get a status update by EOD Thursday? I need it to unblock [specific dependency]. Let me know if that timeline doesn't work.`;
  }
  if (scenario === "disagreement") {
    return `I don't think this approach will meet our goal because [specific reason]. I'd like to propose [alternative] — can we discuss before we commit?`;
  }
  if (scenario === "asking-help") {
    return `I need your input on [specific topic] by [date]. I've documented what I've tried in [link/doc]. What would you recommend as the next step?`;
  }
  return message || `Quick note for ${recipient} — wanted to flag this directly so we're aligned.`;
}

function buildDiplomaticRewrite(
  message: string,
  recipient: string,
  scenario: AnalysisRequest["scenario"]
): string {
  if (scenario === "update-urgency") {
    return `Whenever you have a chance, I'd really appreciate a brief update — totally understand if you're juggling other priorities. Happy to help remove blockers if anything's in the way.`;
  }
  if (scenario === "disagreement") {
    return `I may be missing something here, so please correct me if I'm off — I'm a bit concerned that [gentle concern]. Would love to hear your perspective when you have time.`;
  }
  if (scenario === "asking-help") {
    return `If you have bandwidth, I'd be grateful for any guidance on [topic]. No worries at all if now isn't a good time — I can also loop in someone else.`;
  }
  return `Just a friendly check-in — hope all's well on your end!`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalysisRequest;

    if (!body.draft?.trim()) {
      return NextResponse.json({ error: "Draft is required." }, { status: 400 });
    }

    // Simulate network latency for a realistic loading state
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const result = buildAnalysis(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to analyze message." }, { status: 500 });
  }
}
