import { Sparkles } from "lucide-react";

export function EmptyState({
  title = "No meals logged yet",
  description = "Use the AI food input to start tracking your day.",
}) {
  return (
    <div className="muted-panel flex min-h-56 flex-col items-center justify-center rounded-3xl p-8 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-teal-400/15 text-teal-500">
        <Sparkles className="size-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
