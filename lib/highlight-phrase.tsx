import type { ReactNode } from "react";

export function highlightPhrase(text: string, phrase: string): ReactNode[] {
  if (!phrase.trim()) {
    return [text];
  }

  const index = text.indexOf(phrase);
  if (index === -1) {
    return [text];
  }

  const parts: ReactNode[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const next = text.indexOf(phrase, cursor);
    if (next === -1) {
      parts.push(text.slice(cursor));
      break;
    }

    if (next > cursor) {
      parts.push(text.slice(cursor, next));
    }

    parts.push(
      <mark
        key={`${next}-${phrase}`}
        className="rounded-sm bg-amber-100/90 px-0.5 text-stone-900 not-italic"
      >
        {phrase}
      </mark>
    );

    cursor = next + phrase.length;
  }

  return parts;
}
