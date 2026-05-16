"use client";

import { useState, useTransition } from "react";
import { Activity, LogIn, UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);
  const isConfigured = useAuthStore((state) => state.isConfigured);
  const authError = useAuthStore((state) => state.error);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      try {
        if (mode === "signin") {
          await signIn(email, password);
        } else {
          await signUp(email, password);
          setMessage("Account created. You can now use NutriAI.");
        }
      } catch {
        // Store already carries the auth error.
      }
    });
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="glass w-full max-w-md rounded-[2rem] p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-glow">
            <Activity className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Welcome to NutriAI
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {mode === "signin"
                ? "Sign in to sync your nutrition data."
                : "Create your account to start tracking."}
            </p>
          </div>
        </div>

        {!isConfigured ? (
          <div className="mt-6 rounded-2xl bg-amber-500/10 p-4 text-sm leading-6 text-amber-700 dark:text-amber-200">
            Supabase Auth is not configured yet. Add `NEXT_PUBLIC_SUPABASE_URL`
            and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-white/10">
          <button
            onClick={() => setMode("signin")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${mode === "signin" ? "bg-white shadow-sm dark:bg-slate-950" : "text-slate-500"}`}
          >
            Sign in
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${mode === "signup" ? "bg-white shadow-sm dark:bg-slate-950" : "text-slate-500"}`}
          >
            Create account
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900"
              minLength={6}
              required
            />
          </label>

          {authError ? (
            <p className="rounded-2xl bg-rose-500/10 p-3 text-sm font-semibold text-rose-500">
              {authError}
            </p>
          ) : null}
          {message ? (
            <p className="rounded-2xl bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
              {message}
            </p>
          ) : null}

          <button
            disabled={isPending || !isConfigured}
            className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 font-bold text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mode === "signin" ? (
              <LogIn className="size-5" />
            ) : (
              <UserPlus className="size-5" />
            )}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        {mode === "signin" ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white/60 p-4 text-center text-sm dark:border-white/10 dark:bg-white/5">
            <span className="text-slate-500 dark:text-slate-400">
              New to NutriAI?
            </span>
            <button
              onClick={() => setMode("signup")}
              className="ml-2 font-black text-teal-600 hover:text-teal-500 dark:text-teal-300"
            >
              Sign up now
            </button>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white/60 p-4 text-center text-sm dark:border-white/10 dark:bg-white/5">
            <span className="text-slate-500 dark:text-slate-400">
              Already have an account?
            </span>
            <button
              onClick={() => setMode("signin")}
              className="ml-2 font-black text-teal-600 hover:text-teal-500 dark:text-teal-300"
            >
              Log in
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
