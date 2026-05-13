import { BarChart2, TrendingUp, TrendingDown, List, Zap } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { fmt, card } from "../utils";
import { useIsMobile } from "../hooks/useIsMobile";
import type { Record_, Theme } from "../types";

export function MarketPage({ history, theme }: { history: Record_[]; theme: Theme }) {
  const isMobile = useIsMobile();
  const avg   = history.length ? Math.round(history.reduce((a, b) => a + b.sellerPerOrder, 0) / history.length) : 0;
  const best  = history.length ? history.reduce((a, b) => a.sellerPerOrder < b.sellerPerOrder ? a : b) : null;
  const worst = history.length ? history.reduce((a, b) => a.sellerPerOrder > b.sellerPerOrder ? a : b) : null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14 }}>
        <StatCard label="Keywords Analyzed"    value={history.length} theme={theme} icon={<BarChart2 size={14}/>} />
        <StatCard label="Avg Seller / Order"   value={avg}            theme={theme} icon={<TrendingDown size={14}/>} />
        <StatCard label="Total Orders Tracked" value={history.reduce((a, b) => a + b.queueSum, 0)} theme={theme} icon={<List size={14}/>} />
        <StatCard label="Avg Competition"      value={history.length ? Math.round(history.reduce((a, b) => a + b.competition, 0) / history.length) : 0} theme={theme} icon={<Zap size={14}/>} />
      </div>
      {history.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
          {best && (
            <div style={{ ...card(theme), padding: 20, borderColor: "rgba(34,197,94,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <TrendingDown size={16} color="#22c55e" />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#22c55e", textTransform: "uppercase" }}>Best Opportunity</span>
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: theme === "dark" ? "#f1f5f9" : "#0f172a" }}>{best.keyword}</p>
              <p style={{ fontSize: 30, fontWeight: 800, color: "#22c55e", lineHeight: 1, margin: "8px 0" }}>{fmt(best.sellerPerOrder)}</p>
              <p style={{ fontSize: 12, color: "#64748b" }}>seller/order · lowest competition intensity</p>
            </div>
          )}
          {worst && (
            <div style={{ ...card(theme), padding: 20, borderColor: "rgba(248,113,113,0.25)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <TrendingUp size={16} color="#f87171" />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#f87171", textTransform: "uppercase" }}>Most Saturated</span>
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: theme === "dark" ? "#f1f5f9" : "#0f172a" }}>{worst.keyword}</p>
              <p style={{ fontSize: 30, fontWeight: 800, color: "#f87171", lineHeight: 1, margin: "8px 0" }}>{fmt(worst.sellerPerOrder)}</p>
              <p style={{ fontSize: 12, color: "#64748b" }}>seller/order · high competition intensity</p>
            </div>
          )}
        </div>
      )}
      {history.length === 0 && <p style={{ textAlign: "center", color: "#64748b", padding: "48px 0", fontSize: 13 }}>Save some analyses first.</p>}
    </div>
  );
}
