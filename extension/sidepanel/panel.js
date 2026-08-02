const RISK_LABELS = {
  too_blunt: { text: "太直接", cls: "high" },
  too_soft: { text: "太软，容易被忽略", cls: "medium" },
  wrong_register: { text: "像公文，不像人说话", cls: "neutral" },
  identity_risk: { text: "涉及对方身份，建议整句删掉", cls: "high" },
  none: { text: "这条没问题", cls: "ok" },
};

const RANGE_LABELS = {
  too_blunt: "敏感读者 vs 典型读者",
  too_soft: "即时后果 vs 累积印象",
  wrong_register: "当下察觉 vs 长期印象",
  identity_risk: "当下感受 vs 告知他人之后",
  none: "读法范围",
};

const REWRITE_META = [
  { key: "relational", name: "走关系", sub: "共同目标" },
  { key: "factual", name: "摆事实", sub: "依赖关系" },
  { key: "on-record", name: "留记录", sub: "中性可追溯" },
];

const VIEWS = ["view-loading", "view-empty", "view-error", "view-result"];

function show(id) {
  for (const viewId of VIEWS) {
    document.getElementById(viewId).classList.toggle("hidden", viewId !== id);
  }
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]
  );
}

function formatMeta(timestamp) {
  if (!timestamp) {
    return "刚刚";
  }
  const diff = Date.now() - timestamp;
  if (diff < 60_000) {
    return "刚刚";
  }
  if (diff < 3_600_000) {
    return `${Math.floor(diff / 60_000)} 分钟前`;
  }
  return new Date(timestamp).toLocaleTimeString("zh-CN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function renderDraft(draft, flagged) {
  const el = document.getElementById("draft");
  if (!flagged || !draft.includes(flagged)) {
    el.textContent = draft;
    return;
  }

  const index = draft.indexOf(flagged);
  el.innerHTML =
    escapeHtml(draft.slice(0, index)) +
    `<mark>${escapeHtml(flagged)}</mark>` +
    escapeHtml(draft.slice(index + flagged.length));
}

function applyContext(context) {
  if (!context) {
    return;
  }

  const recipient = document.getElementById("recipient");
  const scenario = document.getElementById("scenario");
  const culture = document.getElementById("culture");
  const goal = document.getElementById("goal");

  if (context.recipient) recipient.value = context.recipient;
  if (context.scenario) scenario.value = context.scenario;
  if (context.recipient_culture) culture.value = context.recipient_culture;
  if (context.sender_goal) goal.value = context.sender_goal;
}

function renderResult(draft, data, context, analyzedAt) {
  const risk =
    RISK_LABELS[data.risk_direction] ||
    RISK_LABELS[data.risk_level === "Low" ? "none" : "medium"];

  const badge = document.getElementById("risk-badge");
  badge.textContent = risk.text;
  badge.className = `badge ${risk.cls}`;

  renderDraft(draft, data.flagged_phrase);

  document.getElementById("range-label").textContent =
    RANGE_LABELS[data.risk_direction] || RANGE_LABELS.none;
  document.getElementById("perception").textContent = data.perception_range;

  const culturalSection = document.getElementById("cultural-section");
  if (data.cultural_note?.trim()) {
    document.getElementById("cultural").textContent = data.cultural_note;
    culturalSection.classList.remove("hidden");
  } else {
    culturalSection.classList.add("hidden");
  }

  const rewritesBox = document.getElementById("rewrites");
  rewritesBox.innerHTML = "";

  for (const meta of REWRITE_META) {
    const text = data.rewrites?.[meta.key];
    if (!text) {
      continue;
    }

    const card = document.createElement("div");
    card.className = "rewrite";
    card.innerHTML = `
      <div class="rewrite-head">
        <span class="rewrite-name">${meta.name}</span>
        <span class="rewrite-sub">${meta.sub}</span>
      </div>
      <div class="rewrite-text"></div>
      <button type="button" data-copy>复制</button>
    `;
    card.querySelector(".rewrite-text").textContent = text;
    rewritesBox.appendChild(card);
  }

  document.getElementById("meta").textContent = formatMeta(analyzedAt);
  applyContext(context);
  show("view-result");
}

document.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-copy]");
  if (copyButton) {
    const text = copyButton
      .closest(".rewrite")
      .querySelector(".rewrite-text").textContent;
    navigator.clipboard.writeText(text).then(() => {
      copyButton.textContent = "已复制";
      copyButton.classList.add("copied");
      setTimeout(() => {
        copyButton.textContent = "复制";
        copyButton.classList.remove("copied");
      }, 1400);
    });
    return;
  }

  const feedbackButton = event.target.closest("[data-fb]");
  if (feedbackButton) {
    chrome.runtime.sendMessage({
      type: "feedback",
      value: feedbackButton.dataset.fb,
    });
    feedbackButton.textContent = "谢谢";
    feedbackButton.classList.add("copied");
  }
});

document.getElementById("reanalyze").addEventListener("click", () => {
  show("view-loading");
  chrome.runtime.sendMessage({
    type: "reanalyze",
    recipient: document.getElementById("recipient").value,
    scenario: document.getElementById("scenario").value,
    recipient_culture: document.getElementById("culture").value,
    sender_goal: document.getElementById("goal").value,
  });
});

document.getElementById("retry").addEventListener("click", () => {
  show("view-loading");
  chrome.runtime.sendMessage({ type: "retry" });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "loading") {
    show("view-loading");
  }
  if (message.type === "empty") {
    show("view-empty");
  }
  if (message.type === "error") {
    document.getElementById("error-message").textContent =
      message.message || "分析失败了。";
    show("view-error");
  }
  if (message.type === "result") {
    renderResult(
      message.draft,
      message.data,
      message.context,
      message.analyzedAt || Date.now()
    );
  }
});

async function restoreFromSession() {
  try {
    const stored = await chrome.storage.session.get([
      "lastResult",
      "pendingState",
    ]);

    if (stored.pendingState === "loading") {
      show("view-loading");
      return;
    }
    if (stored.pendingState === "empty") {
      show("view-empty");
      return;
    }
    if (stored.pendingState === "error") {
      show("view-error");
      return;
    }
    if (stored.lastResult) {
      renderResult(
        stored.lastResult.draft,
        stored.lastResult.data,
        stored.lastResult.context,
        stored.lastResult.analyzedAt
      );
    }
  } catch {
    // session storage unavailable
  }
}

restoreFromSession();
chrome.runtime.sendMessage({ type: "panel-ready" });
