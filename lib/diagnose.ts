import type { DiagnoseApiResponse, RiskDirection, RiskLevel } from "./types";

const RISK_LEVELS: RiskLevel[] = ["High", "Medium", "Low"];
const RISK_DIRECTIONS: RiskDirection[] = [
  "too_blunt",
  "too_soft",
  "wrong_register",
  "none",
];

export function parseDiagnoseResponse(raw: string): DiagnoseApiResponse {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("LLM returned invalid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("LLM response was not a JSON object.");
  }

  const data = parsed as Record<string, unknown>;

  if (
    typeof data.risk_level !== "string" ||
    !RISK_LEVELS.includes(data.risk_level as RiskLevel)
  ) {
    throw new Error('Missing or invalid "risk_level".');
  }

  if (
    typeof data.risk_direction !== "string" ||
    !RISK_DIRECTIONS.includes(data.risk_direction as RiskDirection)
  ) {
    throw new Error('Missing or invalid "risk_direction".');
  }

  if (typeof data.flagged_phrase !== "string") {
    throw new Error('Missing or invalid "flagged_phrase".');
  }

  if (
    typeof data.perception_range !== "string" ||
    !data.perception_range.trim()
  ) {
    throw new Error('Missing or invalid "perception_range".');
  }

  if (typeof data.cultural_note !== "string") {
    throw new Error('Missing or invalid "cultural_note".');
  }

  if (!data.rewrites || typeof data.rewrites !== "object") {
    throw new Error('Missing or invalid "rewrites".');
  }

  const rewrites = data.rewrites as Record<string, unknown>;
  const rewriteKeys = ["relational", "factual", "on-record"] as const;

  for (const key of rewriteKeys) {
    if (typeof rewrites[key] !== "string" || !rewrites[key].trim()) {
      throw new Error(`Missing or invalid rewrites.${key}.`);
    }
  }

  return {
    risk_level: data.risk_level as RiskLevel,
    risk_direction: data.risk_direction as RiskDirection,
    flagged_phrase: data.flagged_phrase.trim(),
    perception_range: data.perception_range.trim(),
    cultural_note: data.cultural_note.trim(),
    rewrites: {
      relational: (rewrites.relational as string).trim(),
      factual: (rewrites.factual as string).trim(),
      "on-record": (rewrites["on-record"] as string).trim(),
    },
  };
}

async function callOpenAI(
  userPrompt: string,
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return content;
}

async function callAnthropic(
  userPrompt: string,
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      temperature: 0.4,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as {
    content?: { type: string; text?: string }[];
  };

  const textBlock = data.content?.find((block) => block.type === "text");
  if (!textBlock?.text) {
    throw new Error("Anthropic returned an empty response.");
  }

  return textBlock.text;
}

export async function callDiagnoseLLM(
  userPrompt: string,
  systemPrompt: string
): Promise<DiagnoseApiResponse> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!openaiKey && !anthropicKey) {
    throw new Error(
      "No LLM API key configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY."
    );
  }

  const raw = openaiKey
    ? await callOpenAI(userPrompt, systemPrompt)
    : await callAnthropic(userPrompt, systemPrompt);

  return parseDiagnoseResponse(raw);
}

export type { DiagnoseApiResponse };
