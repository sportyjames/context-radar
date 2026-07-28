const FEEDBACK_LABELS: Record<string, string> = {
  spot_on: "说得对",
  not_enough: "还不够",
  overinterpreted: "过度解读了",
};

const SURVEY_GOAL_LABELS: Record<string, string> = {
  "read-my-writing": "看看我写的东西会被怎么读",
  "read-incoming": "看懂别人发给我的话到底什么意思",
  both: "两个都想要",
};

const SURVEY_PAIN_LABELS: Record<string, string> = {
  "workplace-formal": "跟老板/同事的正事沟通",
  "interview-prep": "面试准备（BQ / 行为面试）",
  "workplace-casual": "同事之间的闲聊、玩笑、社交邀约",
  "social-outside-work": "工作之外的社交（微信群、约会、社区）",
};

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:6px 12px 6px 0;color:#78716c;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#292524;">${escapeHtml(value)}</td></tr>`;
}

function wrapEmail(title: string, rows: string): string {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;color:#292524;">
      <h2 style="font-size:18px;font-weight:600;margin:0 0 16px;">${escapeHtml(title)}</h2>
      <table style="border-collapse:collapse;font-size:14px;line-height:1.5;">${rows}</table>
      <p style="margin:20px 0 0;font-size:12px;color:#a8a29e;">Context Radar · automated notification</p>
    </div>
  `.trim();
}

export async function sendFeedbackEmail(entry: {
  rating: string;
  reportId: string;
  riskLevel: string;
  submittedAt: string;
}): Promise<boolean> {
  const html = wrapEmail(
    "Context Radar · 新反馈",
    [
      row("评价", FEEDBACK_LABELS[entry.rating] ?? entry.rating),
      row("风险等级", entry.riskLevel),
      row("报告 ID", entry.reportId),
      row("时间", new Date(entry.submittedAt).toLocaleString("zh-CN")),
    ].join("")
  );

  return sendAdminEmail({
    subject: `[Context Radar] 反馈 · ${FEEDBACK_LABELS[entry.rating] ?? entry.rating} · ${entry.riskLevel}`,
    html,
  });
}

export async function sendSurveyEmail(entry: {
  primaryGoal: string;
  painPoint: string;
  submittedAt: string;
}): Promise<boolean> {
  const html = wrapEmail(
    "Context Radar · 新问卷",
    [
      row("最想做什么", SURVEY_GOAL_LABELS[entry.primaryGoal] ?? entry.primaryGoal),
      row("最头疼场景", SURVEY_PAIN_LABELS[entry.painPoint] ?? entry.painPoint),
      row("时间", new Date(entry.submittedAt).toLocaleString("zh-CN")),
    ].join("")
  );

  return sendAdminEmail({
    subject: `[Context Radar] 问卷 · ${SURVEY_GOAL_LABELS[entry.primaryGoal] ?? entry.primaryGoal}`,
    html,
  });
}

async function sendAdminEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;
  const from =
    process.env.EMAIL_FROM ?? "Context Radar <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn(
      "[Context Radar Email] Skipped — set RESEND_API_KEY and ADMIN_EMAIL in .env.local"
    );
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[Context Radar Email] Failed:", errorBody);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Context Radar Email] Error:", error);
    return false;
  }
}
