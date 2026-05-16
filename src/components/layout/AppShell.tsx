"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { useAuthStore } from "@/store/useAuthStore";
import { useNutritionStore } from "@/store/useNutritionStore";

function AuthLoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="glass w-full max-w-sm rounded-[2rem] p-6 text-center">
        <div className="mx-auto mb-4 size-12 animate-pulse rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 shadow-glow" />
        <h1 className="text-xl font-black tracking-tight">
          Checking your session
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Hang tight while NutriAI gets your account ready.
        </p>
      </div>
    </main>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const initializeAuth = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  const isReady = useAuthStore((state) => state.isReady);
  const isConfigured = useAuthStore((state) => state.isConfigured);
  const loadSnapshot = useNutritionStore((state) => state.loadSnapshot);
  const resetData = useNutritionStore((state) => state.resetData);

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isReady) return;

    if ((!isConfigured || !user) && !isLoginPage) {
      resetData();
      router.replace("/login");
      return;
    }

    if (isConfigured && user && isLoginPage) {
      router.replace("/");
      return;
    }

    if (user) {
      void loadSnapshot();
    }
  }, [
    isConfigured,
    isLoginPage,
    isReady,
    loadSnapshot,
    resetData,
    router,
    user,
  ]);

  const canShowProtectedApp = isLoginPage || (isConfigured && Boolean(user));

  return (
    <ThemeProvider>
      {isLoginPage ? (
        children
      ) : !isReady || !canShowProtectedApp ? (
        <AuthLoadingScreen />
      ) : (
        <div className="min-h-screen">
          <Sidebar />
          <div className="min-h-screen lg:pl-72">
            <Navbar />
            <motion.main
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mx-auto w-full max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8"
            >
              {children}
            </motion.main>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}
