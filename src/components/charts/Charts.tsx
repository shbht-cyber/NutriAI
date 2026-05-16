"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNutritionStore } from "@/store/useNutritionStore";
import { weeklyChartData } from "@/utils/nutrition";

export function Charts() {
  const entries = useNutritionStore((state) => state.entries);
  const data = weeklyChartData(entries);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <section className="glass h-80 rounded-[2rem] p-5">
        <h2 className="mb-4 text-lg font-black">Calorie Trends</h2>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="calorieFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 16, border: "0" }} />
            <Area
              type="monotone"
              dataKey="calories"
              stroke="#14b8a6"
              strokeWidth={3}
              fill="url(#calorieFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="glass h-80 rounded-[2rem] p-5">
        <h2 className="mb-4 text-lg font-black">Weekly Macros</h2>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 16, border: "0" }} />
            <Bar dataKey="protein" fill="#22c55e" radius={[8, 8, 0, 0]} />
            <Bar dataKey="carbs" fill="#38bdf8" radius={[8, 8, 0, 0]} />
            <Bar dataKey="fat" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
