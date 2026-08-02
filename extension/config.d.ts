export interface ExtensionConfig {
  BACKEND_URL: string;
  MIN_DRAFT_LENGTH: number;
  DEFAULT_CONTEXT: {
    recipient: string;
    scenario: string;
    recipient_culture: string;
    sender_goal: string;
  };
}
