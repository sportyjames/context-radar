interface PillOptionProps<T extends string> {
  value: T;
  label: string;
  selected: boolean;
  onSelect: (value: T) => void;
  variant?: "slate" | "sage";
}

export function PillOption<T extends string>({
  value,
  label,
  selected,
  onSelect,
  variant = "slate",
}: PillOptionProps<T>) {
  const selectedStyles =
    variant === "sage"
      ? "border-emerald-900 bg-emerald-900 text-stone-100 shadow-sm"
      : "border-stone-800 bg-stone-800 text-white shadow-sm";

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`rounded-full border px-3.5 py-2 text-xs font-medium leading-snug transition-all duration-200 sm:text-[13px] ${
        selected
          ? selectedStyles
          : "border-stone-200/80 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
      }`}
    >
      {label}
    </button>
  );
}
