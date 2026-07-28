export function StaticExample() {
  const draft =
    "Hi, is there any problem with the API fix? Please update by EOD.";
  const flagged = "is there any problem";
  const rewrite =
    "Checking in on the API fix — do you have an ETA for EOD? Let me know if you're blocked on anything.";

  const index = draft.toLowerCase().indexOf(flagged);
  const before = draft.slice(0, index);
  const highlighted = draft.slice(index, index + flagged.length);
  const after = draft.slice(index + flagged.length);

  return (
    <section className="mb-6 rounded-3xl border border-stone-200/60 bg-white/70 p-5 shadow-sm sm:p-6">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-stone-400">
        示例 · 同样一句话，不同读法
      </p>

      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-xs text-stone-500">你写的</p>
          <p className="rounded-2xl border border-stone-200/60 bg-stone-50/60 px-4 py-3 text-[14px] leading-[1.75] text-stone-800">
            {before}
            <mark className="rounded-sm bg-amber-100/90 px-0.5 not-italic">
              {highlighted}
            </mark>
            {after}
          </p>
        </div>

        <div>
          <p className="mb-1.5 text-xs text-stone-500">
            对方可能理解为 · 「是不是你搞砸了？」— 中文里正常的催进度，英文里像在追责
          </p>
        </div>

        <div>
          <p className="mb-1.5 text-xs text-stone-500">改写示例 · 摆事实</p>
          <p className="rounded-2xl border border-stone-200/60 bg-white px-4 py-3 text-[14px] leading-[1.75] text-stone-700">
            {rewrite}
          </p>
        </div>
      </div>
    </section>
  );
}
