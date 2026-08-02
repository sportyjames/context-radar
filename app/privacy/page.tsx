import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Context Radar",
  description: "How Context Radar handles your Gmail draft content.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 sm:px-6 sm:py-16">
      <Link
        href="/"
        className="text-[13px] text-stone-500 transition hover:text-stone-700"
      >
        ← Context Radar
      </Link>

      <h1 className="mt-6 font-serif text-3xl font-medium tracking-tight text-stone-800">
        Privacy Policy
      </h1>
      <p className="mt-2 text-[13px] text-stone-500">Last updated: August 2, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-stone-700">
        <section className="space-y-3">
          <h2 className="text-lg font-medium text-stone-800">Overview</h2>
          <p>
            Context Radar is a Chrome extension that analyzes Gmail drafts to
            help you understand how your message may be read in a Western
            workplace. This policy covers the extension and the web service at{" "}
            <a
              href="https://context-radar-indol.vercel.app"
              className="text-stone-800 underline decoration-stone-300 underline-offset-2"
            >
              context-radar-indol.vercel.app
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-stone-800">
            What we read
          </h2>
          <p>
            The extension reads the <strong>text of your current Gmail
            compose draft</strong> — the message you are writing, not your
            inbox, sent mail, or contacts.
          </p>
          <p>
            We read draft text <strong>only when you click</strong>{" "}
            <em>How does this sound?</em> or <em>Re-analyze</em>. We do{" "}
            <strong>not</strong> read your draft on page load, while you type,
            or on any other event.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-stone-800">
            What we do not do
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>We do not modify your email content.</li>
            <li>We do not send emails on your behalf.</li>
            <li>We do not access your Gmail account or Google credentials.</li>
            <li>We do not require an account or login.</li>
            <li>
              We do not maintain a history of your drafts on our servers.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-stone-800">
            How your draft is processed
          </h2>
          <p>When you request an analysis:</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              The extension sends your draft text and analysis settings
              (recipient, scenario, culture, goal) to our backend API hosted
              on Vercel.
            </li>
            <li>
              Our backend sends the draft to{" "}
              <strong>OpenAI&apos;s API</strong> to generate the analysis and
              suggested rewrites. OpenAI processes the content according to
              their{" "}
              <a
                href="https://openai.com/policies/privacy-policy"
                className="text-stone-800 underline decoration-stone-300 underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
              </a>
              .
            </li>
            <li>
              The result is returned to the extension and shown in the side
              panel.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-stone-800">Storage</h2>
          <p>
            <strong>On our servers:</strong> We do not store your draft text
            after the analysis request completes. Each request is processed
            and discarded.
          </p>
          <p>
            <strong>In the extension:</strong> The most recent analysis result
            is kept in your browser&apos;s session storage so the side panel
            can display it while open. This is cleared when you close the
            browser.
          </p>
          <p>
            <strong>Feedback:</strong> If you click a feedback button
            (&quot;spot on&quot; / &quot;not enough&quot; / &quot;overinterpreted&quot;),
            we record the rating and risk level only — not your draft text.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-stone-800">Permissions</h2>
          <p>
            The extension requests access to <code>mail.google.com</code> to
            inject an analysis button next to Gmail&apos;s Send button and to
            read your compose draft when you click it. It requests{" "}
            <code>sidePanel</code> to show results beside your draft, and{" "}
            <code>storage</code> for temporary session data in your browser.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-stone-800">
            Third-party services
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>OpenAI</strong> — draft analysis (API)
            </li>
            <li>
              <strong>Vercel</strong> — backend hosting
            </li>
            <li>
              <strong>Resend</strong> — optional feedback notification emails
              (no draft content included)
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-stone-800">Contact</h2>
          <p>
            Questions about this policy:{" "}
            <a
              href="mailto:contextradarapp@gmail.com"
              className="text-stone-800 underline decoration-stone-300 underline-offset-2"
            >
              contextradarapp@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
