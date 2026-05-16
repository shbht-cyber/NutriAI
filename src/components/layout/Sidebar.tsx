"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  History,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/history", label: "History", icon: History },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200/70 bg-white/70 px-5 py-6 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 lg:block">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-glow">
          <Activity className="size-6" />
        </span>
        <span>
          <span className="block text-lg font-bold tracking-tight">
            NutriAI
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Calorie intelligence
          </span>
        </span>
      </Link>

      <nav className="mt-10 space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10",
                active &&
                  "bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950",
              )}
            >
              <Icon className="size-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute inset-x-5 bottom-6 rounded-3xl border border-teal-300/50 bg-teal-50 p-4 dark:border-teal-400/20 dark:bg-teal-400/10">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold">
          <Sparkles className="size-4 text-teal-500" />
          AI Coach
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Natural language food logging with macro feedback as your day unfolds.
        </p>
      </div>
    </aside>
  );
}
