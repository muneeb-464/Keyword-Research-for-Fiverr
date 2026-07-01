import { useState } from "react";
import { X } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { Record_, Theme } from "../types";
import { fmt, pctChange, trendTag, trendMeta } from "../utils";

type Metric = "avgOrders" | "competition" | "sellerPerOrder";
const METRICS: { key: Metric; label: string; color: string }[] = [
  { key: "avgOrders",      label: "Avg Orders",  color: "#3b82f6" },
  { key: "competition",    label: "Competition", color: "#6366f1" },
  { key: "sellerPerOrder", label: "SPO",         color: "#22c55e" },
];

export function KeywordDetailModal({ keyword, history, theme, onClose }: {
  keyword: string; history: Record_[]; theme: Theme; onClose: () => void;
}) {
  const [metric, setMetric] = useState<Metric>("sellerPerOrder");

  // history is newest-first; oldest-first snapshots for this keyword:
  const snaps = history.filter(r => r.keyword === keyword).slice().reverse();
  const latest = snaps[snaps.length - 1];
  const prev   = snaps.length >= 2 ? snaps[snaps.length - 2] : null;

  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";
  const textColor = theme === "dark" ? "#64748b" : "#94a3b8";
  const tooltipBg = theme === "dark" ? "#1e293b" : "#ffffff";
  const headColor = theme === "dark" ? "#f1f5f9" : "#0f172a";
  const active    = METRICS.find(m => m.key === metric)!;

  const data = snaps.map(r => ({ name: r.date, value: r[metric] }));
  const trend = prev ? trendTag(prev, latest) : null;
  const spoChange  = prev ? pctChange(prev.sellerPerOrder, latest.sellerPerOrder) : null;
  const compChange = prev ? pctChange(prev.competition, latest.competition) : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-[640px] max-h-[85vh] overflow-y-auto rounded-2xl border bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[16px] font-bold" style={{ color: headColor }}>{keyword}</p>
            <p className="text-[12px] text-slate-500">{snaps.length} snapshot{snaps.length !== 1 ? "s" : ""} tracked</p>
          </div>
          <button onClick={onClose} className="bg-transparent border-0 cursor-pointer text-slate-500 p-1">
            <X size={18} />
          </button>
        </div>

        {trend && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="text-[11px] font-bold px-[10px] py-1 rounded-md"
              style={{ background: `${trendMeta(trend).color}1a`, color: trendMeta(trend).color }}
            >
              {trendMeta(trend).label}
            </span>
            {spoChange !== null && (
              <span className="text-[11px] font-semibold px-[10px] py-1 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                SPO {spoChange <= 0 ? "improved" : "up"} {Math.abs(spoChange)}% since last snapshot {spoChange <= 0 ? "↓" : "↑"}
              </span>
            )}
            {compChange !== null && (
              <span className="text-[11px] font-semibold px-[10px] py-1 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                Competition {compChange >= 0 ? "up" : "down"} {Math.abs(compChange)}% {compChange >= 0 ? "↑" : "↓"}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {METRICS.map(m => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={[
                "text-[11px] font-semibold px-[10px] py-1 rounded-md border cursor-pointer",
                metric === m.key ? "border-blue-500 bg-blue-500/10 text-blue-500" : "border-slate-200 dark:border-slate-700 bg-transparent text-slate-500",
              ].join(" ")}
            >
              {m.label}
            </button>
          ))}
        </div>

        {snaps.length < 2 ? (
          <p className="text-center text-slate-500 py-10 text-[13px]">Save this keyword again later to see its trend over time.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={active.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={active.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: tooltipBg, border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [fmt(Number(v)), active.label]}
              />
              <Area type="monotone" dataKey="value" stroke={active.color} strokeWidth={2.5}
                fill="url(#metricGrad)"
                dot={{ fill: active.color, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: active.color, stroke: tooltipBg, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse min-w-[420px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                {["Date", "Competition", "Avg Orders", "Avg Price", "SPO"].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[10px] font-bold tracking-[0.08em] text-slate-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snaps.slice().reverse().map(r => (
                <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-2 text-[12px] text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="px-3 py-2 text-[12px] text-slate-500 dark:text-slate-400">{fmt(r.competition)}</td>
                  <td className="px-3 py-2 text-[12px] text-slate-500 dark:text-slate-400">{r.avgOrders}</td>
                  <td className="px-3 py-2 text-[12px] text-slate-500 dark:text-slate-400">{r.avgPrice ? `$${fmt(r.avgPrice)}` : "—"}</td>
                  <td className="px-3 py-2 text-[12px] font-bold" style={{ color: headColor }}>{fmt(r.sellerPerOrder)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
