import type { Recipient, RecipientCulture, Scenario, SenderGoal } from "./types";

export const RECIPIENT_OPTIONS: { value: Recipient; label: string }[] = [
  { value: "manager", label: "老板 / 经理" },
  { value: "peer", label: "同事" },
  { value: "cross-functional", label: "跨团队" },
  { value: "direct-report", label: "下属" },
];

export const SCENARIO_OPTIONS: { value: Scenario; label: string }[] = [
  { value: "update-urgency", label: "催进度 / 要更新" },
  { value: "disagreement", label: "表达不同意见" },
  { value: "asking-help", label: "求助" },
  { value: "small-talk", label: "闲聊" },
];

export const RECIPIENT_CULTURE_OPTIONS: {
  value: RecipientCulture;
  label: string;
}[] = [
  { value: "us", label: "美国" },
  { value: "uk", label: "英国" },
  { value: "europe", label: "欧洲大陆" },
  { value: "china", label: "中国" },
  { value: "japan-korea", label: "日韩" },
  { value: "global-mixed", label: "混合国际团队" },
];

export const SENDER_GOAL_OPTIONS: { value: SenderGoal; label: string }[] = [
  { value: "speed", label: "尽快拿到回复" },
  { value: "relationship", label: "保住关系" },
  { value: "on-record", label: "留下书面记录" },
  { value: "probe", label: "试探对方态度" },
];

export function getOptionLabel<T extends { value: string; label: string }>(
  options: T[],
  value: string
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
