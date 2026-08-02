(() => {
  const HOST_ATTR = "data-context-radar-host";
  const MIN_DRAFT_LENGTH = 10;
  const DEBOUNCE_MS = 300;

  let debounceTimer = null;

  function buttonLabel(el) {
    return el.getAttribute("aria-label") || el.getAttribute("data-tooltip") || "";
  }

  function isPrimarySendButton(el) {
    return el.getAttribute("role") === "button" && buttonLabel(el).startsWith("Send");
  }

  function isSendDropdownButton(el) {
    if (el.getAttribute("role") !== "button") {
      return false;
    }
    const label = buttonLabel(el).toLowerCase();
    if (label.includes("send option") || label.includes("more send")) {
      return true;
    }
    // Chevron-only split-button half (label varies by locale).
    const text = (el.textContent || "").trim();
    return text.length === 0 && Boolean(el.querySelector("svg, img"));
  }

  function isSendGroupChild(el, primarySend) {
    return el === primarySend || isSendDropdownButton(el);
  }

  /** Insert after the whole Send split control, not between Send and its chevron. */
  function getSendInsertAnchor(sendButton) {
    const parent = sendButton.parentElement;
    if (!parent) {
      return sendButton;
    }

    const children = [...parent.children];
    const sendIndex = children.indexOf(sendButton);

    // Send + chevron wrapped in a small container (common in compose).
    if (
      children.length <= 3 &&
      children.every((el) => el.getAttribute("role") === "button") &&
      children.every((el) => isSendGroupChild(el, sendButton))
    ) {
      return parent;
    }

    // Flat toolbar: skip past the chevron sibling.
    for (let i = sendIndex + 1; i < children.length; i++) {
      const sibling = children[i];
      if (isSendDropdownButton(sibling)) {
        return sibling;
      }
      break;
    }

    return sendButton;
  }

  function findSendButton() {
    const buttons = document.querySelectorAll('div[role="button"]');
    for (const btn of buttons) {
      if (isPrimarySendButton(btn)) {
        return btn;
      }
    }
    return null;
  }

  function getComposeContainer(fromEl) {
    const dialog = fromEl.closest('[role="dialog"]');
    if (dialog) {
      return dialog;
    }

    let el = fromEl.parentElement;
    while (el && el !== document.body) {
      const editables = el.querySelectorAll('[contenteditable="true"]');
      if (editables.length === 1) {
        return el;
      }
      el = el.parentElement;
    }

    return null;
  }

  function getDraftText(buttonEl) {
    const container = getComposeContainer(buttonEl);
    if (!container) {
      return "";
    }

    const editable =
      container.querySelector('[role="textbox"][contenteditable="true"]') ||
      container.querySelector('[contenteditable="true"][g_editable="true"]') ||
      container.querySelector('[contenteditable="true"]');

    return editable?.innerText?.trim() || "";
  }

  function createButtonStyles() {
    return `
      :host { display: inline-flex; vertical-align: middle; }
      button {
        all: initial;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
          "Microsoft YaHei", sans-serif;
        font-size: 13px;
        line-height: 1;
        color: #1a1a19;
        background: #f7f6f3;
        border: 1px solid #d3d1c7;
        border-radius: 18px;
        padding: 8px 14px 8px 11px;
        margin-left: 8px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        box-sizing: border-box;
      }
      button:hover:not(:disabled) { background: #eceae4; }
      button:disabled { opacity: 0.65; cursor: default; }
      .icon {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #854f0b;
        color: #fff;
        font-size: 9px;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .spinner {
        width: 12px;
        height: 12px;
        border: 2px solid #d3d1c7;
        border-top-color: #5f5e5a;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `;
  }

  function setButtonIdle(btn, shadow) {
    btn.disabled = false;
    shadow.querySelector(".spinner")?.remove();
    if (!shadow.querySelector(".icon")) {
      const icon = document.createElement("span");
      icon.className = "icon";
      icon.textContent = "CR";
      btn.prepend(icon);
    }
    const label = btn.querySelector(".label");
    if (label) {
      label.textContent = "How does this sound?";
    }
  }

  function setButtonLoading(btn, shadow) {
    btn.disabled = true;
    shadow.querySelector(".icon")?.remove();
    if (!shadow.querySelector(".spinner")) {
      const spinner = document.createElement("span");
      spinner.className = "spinner";
      btn.prepend(spinner);
    }
    const label = btn.querySelector(".label");
    if (label) {
      label.textContent = "Analyzing…";
    }
  }

  function injectButton(sendButton) {
    const anchor = getSendInsertAnchor(sendButton);
    const parent = anchor.parentElement;
    if (!parent) {
      return;
    }

    if (parent.querySelector(`[${HOST_ATTR}]`)) {
      return;
    }

    const host = document.createElement("div");
    host.setAttribute(HOST_ATTR, "true");

    const shadow = host.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = createButtonStyles();

    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", "How does this sound?");

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = "CR";

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = "How does this sound?";

    btn.append(icon, label);

    btn.addEventListener("click", () => {
      const text = getDraftText(host);
      setButtonLoading(btn, shadow);

      const safetyTimer = setTimeout(() => {
        setButtonIdle(btn, shadow);
      }, 60_000);

      chrome.runtime.sendMessage(
        {
          type: "analyze",
          text,
          minLength: MIN_DRAFT_LENGTH,
        },
        () => {
          clearTimeout(safetyTimer);
          setButtonIdle(btn, shadow);
          void chrome.runtime.lastError;
        }
      );
    });

    shadow.append(style, btn);

    if (anchor.nextSibling) {
      parent.insertBefore(host, anchor.nextSibling);
    } else {
      parent.appendChild(host);
    }
  }

  function tryInject() {
    const sendButton = findSendButton();
    if (!sendButton) {
      return;
    }
    injectButton(sendButton);
  }

  function scheduleInject() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(tryInject, DEBOUNCE_MS);
  }

  const observer = new MutationObserver(scheduleInject);
  observer.observe(document.body, { childList: true, subtree: true });
  scheduleInject();
})();
