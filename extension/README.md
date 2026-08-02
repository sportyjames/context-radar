# Context Radar — Gmail Extension

Manifest V3 Chrome extension that analyzes Gmail drafts via the existing Context Radar backend.

## Load (development)

1. Start the web app: `npm run dev` (default `http://localhost:3000`)
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. **Load unpacked** → select this `extension/` folder
5. Open Gmail, compose a draft, click **How does this sound?**

## Production

1. Set `BACKEND_URL` in `config.js` to your deployed app URL
2. Add that URL to `host_permissions` in `manifest.json`
3. Ensure `NEXT_PUBLIC_APP_URL` (or Vercel URL) is set so CORS allows the web app; extension origins (`chrome-extension://…`) are already allowed

## Architecture

```
content script → service worker → /api/diagnose → side panel
```

The content script never calls the backend directly (CORS). Draft text is read only on explicit button click.
