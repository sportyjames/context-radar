import type { AnalysisResult, DiagnoseApiResponse, RiskLevel } from "./types";

const RISK_SUMMARIES: Record<RiskLevel, string> = {
  Low: "Your tone reads as generally appropriate, with minor room to add warmth or context.",
  Medium:
    "Some phrasing may come across as more demanding or abrupt than you intend—especially without relationship context.",
  High:
    "This message carries a strong directive or emotional charge that could trigger defensiveness or resentment.",
};

export function mapDiagnoseToAnalysisResult(
  response: DiagnoseApiResponse
): AnalysisResult {
  return {
    riskLevel: response.risk_level,
    riskSummary: RISK_SUMMARIES[response.risk_level],
    recipientFeeling: response.perception_warning,
    culturalExplanation: response.cultural_decoder,
    rewrites: [
      {
        label: "Collaborative",
        text: response.rewrites.collaborative,
      },
      {
        label: "Assertive & Clear",
        text: response.rewrites.assertive,
      },
      {
        label: "Diplomatic / Softened",
        text: response.rewrites.diplomatic,
      },
    ],
  };
}
