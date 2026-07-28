import { NextResponse } from "next/server";
import type { FeedbackRating, RiskLevel } from "@/lib/types";
import { sendFeedbackEmail } from "@/lib/send-admin-email";

interface FeedbackBody {
  rating?: FeedbackRating;
  reportId?: string;
  riskLevel?: RiskLevel;
}

const VALID_RATINGS: FeedbackRating[] = [
  "spot_on",
  "not_enough",
  "overinterpreted",
];

const VALID_RISK_LEVELS: RiskLevel[] = ["Low", "Medium", "High"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FeedbackBody;

    if (!body.rating || !VALID_RATINGS.includes(body.rating)) {
      return NextResponse.json({ error: "Invalid rating." }, { status: 400 });
    }

    if (!body.reportId?.trim()) {
      return NextResponse.json({ error: "reportId is required." }, { status: 400 });
    }

    if (!body.riskLevel || !VALID_RISK_LEVELS.includes(body.riskLevel)) {
      return NextResponse.json({ error: "Invalid riskLevel." }, { status: 400 });
    }

    const entry = {
      rating: body.rating,
      reportId: body.reportId.trim(),
      riskLevel: body.riskLevel,
      submittedAt: new Date().toISOString(),
    };

    console.info("[Context Radar Feedback]", JSON.stringify(entry));

    await sendFeedbackEmail(entry);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to record feedback." }, { status: 500 });
  }
}
