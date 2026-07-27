export function Header() {
  return (
    <header className="px-5 pt-10 pb-8 sm:px-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="mb-5 inline-flex items-center rounded-full border border-stone-200/80 bg-white/80 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-stone-600 shadow-sm">
          🌿 AI Communication Clinic &amp; Perception Lab
        </span>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-stone-800 sm:text-[2.75rem] sm:leading-tight">
          Context Radar
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-stone-500">
          Understand how you&apos;re perceived before you hit send. A safe space
          for your workplace draft messages.
        </p>
      </div>
    </header>
  );
}
