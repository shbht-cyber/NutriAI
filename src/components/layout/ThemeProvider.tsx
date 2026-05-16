"use client";

import { useEffect } from "react";
import { useNutritionStore } from "@/store/useNutritionStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useNutritionStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return children;
}
