import type { Recipient, Scenario } from "./types";

export const RECIPIENT_OPTIONS: { value: Recipient; label: string }[] = [
  { value: "manager", label: "Manager" },
  { value: "peer", label: "Peer / Colleague" },
  { value: "cross-functional", label: "Cross-functional Team" },
  { value: "direct-report", label: "Direct Report" },
];

export const SCENARIO_OPTIONS: { value: Scenario; label: string }[] = [
  { value: "update-urgency", label: "Asking for Update / Urgency" },
  { value: "disagreement", label: "Expressing Disagreement" },
  { value: "asking-help", label: "Asking for Help" },
  { value: "small-talk", label: "Small Talk / Casual" },
];

export const RECIPIENT_LABELS: Record<Recipient, string> = {
  manager: "your manager",
  peer: "your peer",
  "cross-functional": "the cross-functional team",
  "direct-report": "your direct report",
};
