import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Bar, Line, Legend,
} from "recharts";
import type { Record_, Theme } from "../types";

export function TrendsPage({ history, theme }: { history: Record_[]; theme: Theme }) {
  const data = [...history].reverse().map(r => ({
    name:           r.keyword.split(" ")[0],
    "Seller/Order": r.sellerPerOrder,
    Competition:    r.competition,
  }));

  const gridColor  = theme === "dark" ? "#334155" : "#e2e8f0";
  const textColor  = theme === "dark" ? "#64748b" : "#94a3b8";
  const tooltipBg  = theme === "dark" ? "#1e293b" : "#ffffff";
  const tooltipBdr = theme === "dark" ? "#334155" : "#e2e8f0";
  const headColor  = theme === "dark" ? "#f1f5f9" : "#0f172a";

  const ttStyle: React.CSSProperties = {
    background: tooltipBg, border: `1px solid ${tooltipBdr}`,
    borderRadius: 8, fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:shadow-none outline-none p-6" tabIndex={-1}>
        <p className="text-[15px] font-bold mb-1" style={{ color: headColor }}>Seller / Order Trend</p>
        <p className="text-[12px] text-slate-500 mb-5">Lower = better market opportunity</p>
        {data.length < 2 ? (
          <p className="text-center text-slate-500 py-10 text-[13px]">Need at least 2 saved analyses.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={ttStyle} cursor={{ stroke: gridColor, strokeWidth: 1, fill: "transparent" }} />
              <Area type="monotone" dataKey="Seller/Order" stroke="#3b82f6" strokeWidth={2.5}
                fill="url(#spoGrad)"
                dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#3b82f6", stroke: tooltipBg, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {data.length >= 2 && (
        <div className="rounded-2xl border bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:shadow-none outline-none p-6" tabIndex={-1}>
          <p className="text-[15px] font-bold mb-1" style={{ color: headColor }}>Competition vs Seller/Order</p>
          <p className="text-[12px] text-slate-500 mb-5">Bars = Competition (left) · Line = Seller/Order (right)</p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={data} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#22c55e", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={ttStyle} cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)" }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                formatter={(value) => <span style={{ color: textColor }}>{value}</span>} />
              <Bar yAxisId="left" dataKey="Competition" fill="#6366f1" fillOpacity={0.7} radius={[4, 4, 0, 0]} maxBarSize={44} />
              <Line yAxisId="right" type="monotone" dataKey="Seller/Order" stroke="#22c55e" strokeWidth={2.5}
                dot={{ fill: "#22c55e", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#22c55e", stroke: tooltipBg, strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
