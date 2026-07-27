export function Header() {
  return (
    <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-3xl flex-col gap-1 px-6 py-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          ContextRadar
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Understand how you&apos;re perceived before you hit send.
        </p>
      </div>
    </header>
  );
}
