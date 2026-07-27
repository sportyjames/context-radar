interface CulturalDecoderCardProps {
  explanation: string;
}

export function CulturalDecoderCard({ explanation }: CulturalDecoderCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
        💡 Cultural Decoder
      </h2>
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {explanation}
      </p>
    </article>
  );
}
