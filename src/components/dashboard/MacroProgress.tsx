import { clampPercent } from "@/utils/nutrition";

type Props = {
  label: string;
  value: number;
  goal: number;
  color: string;
  suffix?: string;
};

export function MacroProgress({
  label,
  value,
  goal,
  color,
  suffix = "g",
}: Props) {
  const percent = clampPercent(value, goal);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          {label}
        </span>
        <span className="font-bold">
          {Math.round(value)}
          {suffix} / {goal}
          {suffix}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  );
}
