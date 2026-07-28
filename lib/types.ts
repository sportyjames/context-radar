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

export type RecipientCulture =
  | "us"
  | "uk"
  | "europe"
  | "china"
  | "japan-korea"
  | "global-mixed";

export type SenderGoal = "speed" | "relationship" | "on-record" | "probe";

export type RiskLevel = "Low" | "Medium" | "High";

export type RiskDirection = "too_blunt" | "too_soft" | "wrong_register" | "none";

export type FeedbackRating = "spot_on" | "not_enough" | "overinterpreted";

export type SurveyPrimaryGoal =
  | "read-my-writing"
  | "read-incoming"
  | "both";

export type SurveyPainPoint =
  | "workplace-formal"
  | "interview-prep"
  | "workplace-casual"
  | "social-outside-work";

export interface DiagnoseApiResponse {
  risk_level: RiskLevel;
  risk_direction: RiskDirection;
  flagged_phrase: string;
  perception_range: string;
  cultural_note: string;
  rewrites: {
    relational: string;
    factual: string;
    "on-record": string;
  };
}

export interface PersonaRewrite {
  label: "走关系" | "摆事实" | "留记录";
  text: string;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  riskDirection: RiskDirection;
  flaggedPhrase: string;
  perceptionRange: string;
  culturalNote: string;
  rewrites: PersonaRewrite[];
}
