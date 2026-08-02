# Chrome Web Store Listing — Context Radar

Use this when submitting at https://chrome.google.com/webstore/devconsole

---

## Privacy Policy URL

```
https://context-radar-indol.vercel.app/privacy
```

Deploy the latest code to Vercel before submitting so this page is live.

---

## Single purpose description

```
Analyze Gmail drafts for workplace communication risk before sending.
```

---

## Short description (132 chars max)

```
See how your Gmail draft may land before you send. Read-only. Analyzes only when you click.
```

---

## Detailed description

```
Context Radar helps professionals — especially those writing in a second language — understand how a Gmail draft may be read in a Western workplace before they hit Send.

HOW IT WORKS
• Open Gmail and compose a message as usual
• Click "How does this sound?" next to the Send button
• A side panel shows how the message may land, with suggested rewrites you can copy

PRIVACY BY DESIGN
• Gmail only — works on mail.google.com
• Read-only — never modifies your email
• Analyzes only when you click the button — not while you type or on page load
• No account, no login, no history stored on our servers
• Draft text is sent to our API for analysis and is not retained after processing

WHAT YOU GET
• Risk assessment (too blunt, too soft, wrong register, identity-related remarks, or all clear)
• How different readers may interpret your message
• Cultural context when relevant
• Three rewrite options with different strategies — copy only, never auto-replace

Built for Chinese-speaking professionals navigating English workplace communication.
```

---

## Category

Productivity

---

## Language

English (primary listing). UI includes Chinese labels in the side panel.

---

## Permission justifications (for reviewer)

### host_permissions: https://mail.google.com/*

Required to inject the "How does this sound?" button next to Gmail's Send button in the compose window, and to read the draft text from the active compose area when the user explicitly clicks the button. The extension does not access inbox, sent mail, labels, or contacts.

### host_permissions: https://context-radar-indol.vercel.app/*

Required for the extension's service worker to call our analysis API. Content scripts do not call the API directly (CORS); all network requests go through the background service worker.

### sidePanel

Required to display analysis results in Chrome's side panel, so the user can read the analysis alongside their Gmail draft without covering the compose window.

### storage

Required to store the current analysis result in chrome.storage.session so the side panel can display it after opening. Data is session-scoped and cleared when the browser closes.

### activeTab

Used as a fallback entry point — clicking the extension toolbar icon opens the side panel on the active Gmail tab.

---

## Screenshot instructions

Capture at **1280×800** (recommended) or **640×400**:

1. Open Gmail → New Message
2. Paste sample draft:
   ```
   Hi Albert,
   You told me you would inform me about the front end tasks this afternoon.
   I have not heard anything yet. What is the problem?
   Regards, Jiayu
   ```
3. Click **How does this sound?**
4. Wait for side panel results
5. Screenshot showing **Gmail compose + side panel together**
6. Optional 2nd screenshot: empty-state or rewrite copy buttons

On Mac: `Cmd + Shift + 4` → drag to select area.

---

## Icons

Already in `extension/icons/`:
- icon16.png
- icon48.png
- icon128.png (use for Store listing)

Consider upgrading design before launch — current icons are functional placeholders.

---

## Checklist before Submit

- [ ] Privacy policy live at `/privacy`
- [ ] Extension uses production Vercel URL (not localhost)
- [ ] E2E tests passed
- [ ] Zip `extension/` folder (all files, keep folder structure)
- [ ] $5 developer account registered
- [ ] At least 1 screenshot uploaded
- [ ] Privacy policy URL filled in listing form

---

## Package for upload

From repo root:

```bash
cd extension && zip -r ../context-radar-extension.zip . -x "*.md" && cd ..
```

Upload `context-radar-extension.zip` in the Developer Dashboard.
