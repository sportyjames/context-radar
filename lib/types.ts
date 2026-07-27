export type Recipient =
  | "manager"
  | "peer"
  | "cross-functional"
  | "direct-report";

export type Scenario =
  | "update-urgency"
  | "disagreement"
  | "asking-help"
  | "small-talk";

export type RiskLevel = "Low" | "Medium" | "High";

export interface AnalysisRequest {
  draft: string;
  recipient: Recipient;
  scenario: Scenario;
}

export interface DiagnoseApiResponse {
  risk_level: RiskLevel;
  perception_warning: string;
  cultural_decoder: string;
  rewrites: {
    collaborative: string;
    assertive: string;
    diplomatic: string;
  };
}

export interface PersonaRewrite {
  label: "Collaborative" | "Assertive & Clear" | "Diplomatic / Softened";
  text: string;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  riskSummary: string;
  recipientFeeling: string;
  culturalExplanation: string;
  rewrites: PersonaRewrite[];
}
