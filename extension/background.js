import { CONFIG } from "./config.js";

const SESSION_KEY = "lastResult";
const CONTEXT_KEY = "lastContext";

const FEEDBACK_MAP = {
  right: "spot_on",
  weak: "not_enough",
  over: "overinterpreted",
};

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(() => {});

async function broadcastToPanel(message) {
  try {
    await chrome.runtime.sendMessage(message);
  } catch {
    // Panel may not be open yet
  }
}

async function callDiagnose(text, context) {
  const response = await fetch(`${CONFIG.BACKEND_URL}/api/diagnose`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      draft: text,
      recipient: context.recipient,
      scenario: context.scenario,
      recipient_culture: context.recipient_culture,
      sender_goal: context.sender_goal,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Analysis failed.");
  }
  return data;
}

async function runAnalysis(text, context) {
  await chrome.storage.session.set({
    pendingState: "loading",
    lastContext: context,
    lastDraft: text,
  });

  await broadcastToPanel({ type: "loading" });

  if (!text || text.length < CONFIG.MIN_DRAFT_LENGTH) {
    await chrome.storage.session.set({ pendingState: "empty" });
    await broadcastToPanel({ type: "empty" });
    return;
  }

  try {
    const data = await callDiagnose(text, context);
    const payload = {
      draft: text,
      data,
      context,
      analyzedAt: Date.now(),
    };

    await chrome.storage.session.set({
      lastResult: payload,
      pendingState: "result",
      lastContext: context,
      lastDraft: text,
    });

    await broadcastToPanel({
      type: "result",
      draft: text,
      data,
      context,
      analyzedAt: payload.analyzedAt,
    });
  } catch (error) {
    await chrome.storage.session.set({ pendingState: "error" });
    await broadcastToPanel({
      type: "error",
      message: error instanceof Error ? error.message : "Analysis failed.",
    });
  }
}

async function sendFeedback(rating, riskLevel, reportId) {
  try {
    await fetch(`${CONFIG.BACKEND_URL}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, riskLevel, reportId }),
    });
  } catch {
    // Best-effort
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Must open panel synchronously — user gesture is lost after any await.
  if (message.type === "analyze") {
    const tabId = sender.tab?.id;
    if (tabId) {
      chrome.sidePanel.open({ tabId }).catch(() => {});
    }
    sendResponse({ ok: true });
    void runAnalysis(message.text || "", CONFIG.DEFAULT_CONTEXT);
    return false;
  }

  if (message.type === "reanalyze") {
    sendResponse({ ok: true });
    void (async () => {
      const stored = await chrome.storage.session.get([
        "lastDraft",
        "lastContext",
      ]);
      const text = stored.lastDraft || "";
      const context = {
        recipient: message.recipient || CONFIG.DEFAULT_CONTEXT.recipient,
        scenario: message.scenario || CONFIG.DEFAULT_CONTEXT.scenario,
        recipient_culture:
          message.recipient_culture || CONFIG.DEFAULT_CONTEXT.recipient_culture,
        sender_goal: message.sender_goal || CONFIG.DEFAULT_CONTEXT.sender_goal,
      };
      await runAnalysis(text, context);
    })();
    return false;
  }

  if (message.type === "retry") {
    sendResponse({ ok: true });
    void (async () => {
      const stored = await chrome.storage.session.get([
        "lastDraft",
        "lastContext",
      ]);
      await runAnalysis(
        stored.lastDraft || "",
        stored.lastContext || CONFIG.DEFAULT_CONTEXT
      );
    })();
    return false;
  }

  (async () => {
    if (message.type === "reanalyze" || message.type === "retry") {
      return;
    }

    if (message.type === "feedback") {
      const stored = await chrome.storage.session.get(["lastResult"]);
      const result = stored.lastResult;
      if (result) {
        const rating = FEEDBACK_MAP[message.value];
        if (rating) {
          const reportId = `CR-${result.analyzedAt.toString(36).toUpperCase().slice(-5)}`;
          await sendFeedback(rating, result.data.risk_level, reportId);
        }
      }
      sendResponse({ ok: true });
      return;
    }

    if (message.type === "panel-ready") {
      const stored = await chrome.storage.session.get([
        SESSION_KEY,
        "pendingState",
        CONTEXT_KEY,
      ]);

      if (stored.pendingState === "loading") {
        await broadcastToPanel({ type: "loading" });
      } else if (stored.pendingState === "empty") {
        await broadcastToPanel({ type: "empty" });
      } else if (stored.pendingState === "error") {
        await broadcastToPanel({ type: "error" });
      } else if (stored.lastResult) {
        await broadcastToPanel({
          type: "result",
          draft: stored.lastResult.draft,
          data: stored.lastResult.data,
          context: stored.lastResult.context,
          analyzedAt: stored.lastResult.analyzedAt,
        });
      } else {
        await broadcastToPanel({ type: "empty" });
      }

      sendResponse({ ok: true });
    }
  })();

  return true;
});
