/** @type {import('./config.d.ts').ExtensionConfig} */
export const CONFIG = {
  // Local dev — change to your deployed URL in production
  // and add that host to manifest.json host_permissions.
  BACKEND_URL: "https://context-radar-indol.vercel.app",

  MIN_DRAFT_LENGTH: 10,

  DEFAULT_CONTEXT: {
    recipient: "manager",
    scenario: "update-urgency",
    recipient_culture: "us",
    sender_goal: "speed",
  },
};
