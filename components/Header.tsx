export function Header() {
  return (
    <header className="px-5 pt-10 pb-6 sm:px-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="mb-5 inline-flex items-center rounded-full border border-stone-200/80 bg-white/80 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-stone-600 shadow-sm">
          🌿 Context Radar · 职场消息感知实验室
        </span>
        <h1 className="font-serif text-[1.65rem] font-medium leading-snug tracking-tight text-stone-800 sm:text-3xl sm:leading-snug">
          中文思维写的英文消息，
          <br className="hidden sm:block" />
          在西方同事眼里是另一个意思。
        </h1>
        <div className="mt-4 max-w-lg space-y-1.5 text-[14px] leading-relaxed text-stone-500">
          <p>你以为的礼貌，可能被读成没有主见。</p>
          <p>你以为的直接，可能被读成有攻击性。</p>
          <p>ChatGPT 不会主动告诉你这些，因为它不知道你需要问。</p>
        </div>
      </div>
    </header>
  );
}
