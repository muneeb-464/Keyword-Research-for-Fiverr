import type { CSSProperties } from "react";
import type { Record_, Theme, Trend } from "./types";

export const fmt     = (n: number) => n.toLocaleString();
export const uid     = () => Math.random().toString(36).slice(2, 9);
export const fmtDate = () =>
  new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function calcSPO(competition: number, queueSum: number) {
  if (queueSum === 0 || competition === 0) return 0;
  const avg = queueSum / 20;
  return Math.round(competition / avg);
}
export function calcAvg(queueSum: number) { return +(queueSum / 20).toFixed(2); }

export function spoColor(v: number, theme: Theme) {
  if (v === 0)   return theme === "dark" ? "#64748b" : "#94a3b8";
  if (v <= 300)  return "#22c55e";
  if (v <= 600)  return "#10b981";
  if (v <= 1200) return "#f59e0b";
  if (v <= 2500) return "#f97316";
  if (v <= 4000) return "#ef4444";
  return "#dc2626";
}
export function spoLabel(v: number) {
  if (v === 0)   return "";
  if (v <= 300)  return "Excellent";
  if (v <= 600)  return "Very Strong";
  if (v <= 1200) return "Good";
  if (v <= 2500) return "Medium";
  if (v <= 4000) return "Hard";
  return "Very Hard";
}
export function spoAdvice(v: number) {
  if (v === 0)   return "";
  if (v <= 300)  return "Create Gig Immediately";
  if (v <= 600)  return "High Potential";
  if (v <= 1200) return "Can Work";
  if (v <= 2500) return "Needs Strong SEO";
  if (v <= 4000) return "Avoid if Beginner";
  return "Avoid";
}

export function pctChange(oldV: number, newV: number): number {
  if (oldV === 0) return newV === 0 ? 0 : 100;
  return +(((newV - oldV) / oldV) * 100).toFixed(1);
}

// prev/curr must be same keyword, prev = older snapshot, curr = newer snapshot
export function trendTag(prev: Record_, curr: Record_): Trend {
  const ordersPct = pctChange(prev.avgOrders, curr.avgOrders);
  const compPct   = pctChange(prev.competition, curr.competition);
  if (ordersPct < 0)                                return "Declining";
  if (compPct > ordersPct + 5)                       return "Saturating";
  if (ordersPct > 0 && Math.abs(compPct) <= 5)       return "Rising Demand";
  return "Stable";
}

export function trendMeta(t: Trend) {
  switch (t) {
    case "Rising Demand": return { color: "#22c55e", label: "Rising Demand" };
    case "Saturating":    return { color: "#f59e0b", label: "Saturating" };
    case "Declining":     return { color: "#ef4444", label: "Declining" };
    default:              return { color: "#64748b", label: "Stable" };
  }
}

function parseExtra(s: string): CSSProperties {
  const m: Record<string, string> = {};
  s.split(";").forEach(p => {
    const [k, v] = p.split(":").map(x => x.trim());
    if (k && v) m[k] = v;
  });
  return m as CSSProperties;
}

export function card(theme: Theme, extra = ""): CSSProperties {
  return {
    background:   theme === "dark" ? "#1e293b" : "#ffffff",
    border:       `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`,
    borderRadius: 16,
    outline:      "none",
    ...parseExtra(extra),
  };
}
