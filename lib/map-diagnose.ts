import type { AnalysisResult, DiagnoseApiResponse } from "./types";

export function mapDiagnoseToAnalysisResult(
  response: DiagnoseApiResponse
): AnalysisResult {
  return {
    riskLevel: response.risk_level,
    riskDirection: response.risk_direction,
    flaggedPhrase: response.flagged_phrase,
    perceptionRange: response.perception_range,
    culturalNote: response.cultural_note,
    rewrites: [
      { label: "走关系", text: response.rewrites.relational },
      { label: "摆事实", text: response.rewrites.factual },
      { label: "留记录", text: response.rewrites["on-record"] },
    ],
  };
}
