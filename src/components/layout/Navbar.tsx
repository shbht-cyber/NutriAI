"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Moon, Search, Sun, UserCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNutritionStore } from "@/store/useNutritionStore";
import { cn } from "@/lib/utils";

const mobileLinks = [
  { href: "/", label: "Home" },
  { href: "/history", label: "History" },
  { href: "/analytics", label: "Charts" },
  { href: "/settings", label: "Settings" },
];

export function Navbar() {
  const pathname = usePathname();
  const theme = useNutritionStore((state) => state.theme);
  const setTheme = useNutritionStore((state) => state.setTheme);
  const filters = useNutritionStore((state) => state.filters);
  const setFilters = useNutritionStore((state) => state.setFilters);
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const isConfigured = useAuthStore((state) => state.isConfigured);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative hidden w-full max-w-md sm:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.query}
              onChange={(event) => setFilters({ query: event.target.value })}
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-11 pr-4 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
              placeholder="Search foods, meals, ingredients"
            />
          </div>
          <nav className="flex gap-1 overflow-x-auto lg:hidden">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold text-slate-500 dark:text-slate-300",
                  pathname === link.href &&
                    "bg-slate-950 text-white dark:bg-white dark:text-slate-950",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isConfigured ? (
            <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold dark:border-white/10 dark:bg-white/5 md:flex">
              <UserCircle className="size-4 text-teal-500" />
              <span className="max-w-40 truncate">{user?.email}</span>
            </div>
          ) : null}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="focus-ring grid size-11 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </button>
          {isConfigured ? (
            <button
              onClick={() => void signOut()}
              className="focus-ring grid size-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              aria-label="Sign out"
            >
              <LogOut className="size-5" />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
