import { NextResponse } from "next/server";
import type { SurveyPainPoint, SurveyPrimaryGoal } from "@/lib/types";
import { sendSurveyEmail } from "@/lib/send-admin-email";

interface SurveyBody {
  primaryGoal?: SurveyPrimaryGoal;
  painPoint?: SurveyPainPoint;
}

const VALID_PRIMARY_GOALS: SurveyPrimaryGoal[] = [
  "read-my-writing",
  "read-incoming",
  "both",
];

const VALID_PAIN_POINTS: SurveyPainPoint[] = [
  "workplace-formal",
  "interview-prep",
  "workplace-casual",
  "social-outside-work",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SurveyBody;

    if (!body.primaryGoal || !VALID_PRIMARY_GOALS.includes(body.primaryGoal)) {
      return NextResponse.json({ error: "Invalid primaryGoal." }, { status: 400 });
    }

    if (!body.painPoint || !VALID_PAIN_POINTS.includes(body.painPoint)) {
      return NextResponse.json({ error: "Invalid painPoint." }, { status: 400 });
    }

    const entry = {
      primaryGoal: body.primaryGoal,
      painPoint: body.painPoint,
      submittedAt: new Date().toISOString(),
    };

    console.info("[Context Radar Survey]", JSON.stringify(entry));

    await sendSurveyEmail(entry);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to record survey." }, { status: 500 });
  }
}
