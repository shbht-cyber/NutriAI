export function LoadingSkeleton() {
  return (
    <div className="glass animate-pulse rounded-3xl p-5">
      <div className="h-5 w-1/3 rounded-full bg-slate-200 dark:bg-white/10" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="h-16 rounded-2xl bg-slate-200 dark:bg-white/10" />
        <div className="h-16 rounded-2xl bg-slate-200 dark:bg-white/10" />
      </div>
    </div>
  );
}
