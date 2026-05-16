import { BarChart2, TrendingUp, TrendingDown, List, Zap } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { fmt } from "../utils";
import { useIsMobile } from "../hooks/useIsMobile";
import type { Record_, Theme } from "../types";

export function MarketPage({ history, theme }: { history: Record_[]; theme: Theme }) {
  const isMobile = useIsMobile();
  const avg   = history.length ? Math.round(history.reduce((a, b) => a + b.sellerPerOrder, 0) / history.length) : 0;
  const best  = history.length ? history.reduce((a, b) => a.sellerPerOrder < b.sellerPerOrder ? a : b) : null;
  const worst = history.length ? history.reduce((a, b) => a.sellerPerOrder > b.sellerPerOrder ? a : b) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className={`grid gap-[14px] ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
        <StatCard label="Keywords Analyzed"    value={history.length} theme={theme} icon={<BarChart2 size={14}/>} />
        <StatCard label="Avg Seller / Order"   value={avg}            theme={theme} icon={<TrendingDown size={14}/>} />
        <StatCard label="Total Orders Tracked" value={history.reduce((a, b) => a + b.queueSum, 0)} theme={theme} icon={<List size={14}/>} />
        <StatCard label="Avg Competition"      value={history.length ? Math.round(history.reduce((a, b) => a + b.competition, 0) / history.length) : 0} theme={theme} icon={<Zap size={14}/>} />
      </div>

      {history.length > 0 && (
        <div className={`grid gap-[14px] ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          {best && (
            <div className="rounded-2xl border border-green-500/30 bg-white dark:bg-slate-800 outline-none p-5">
              <div className="flex items-center gap-2 mb-[10px]">
                <TrendingDown size={16} color="#22c55e" />
                <span className="text-[11px] font-bold tracking-[0.1em] text-green-500 uppercase">Best Opportunity</span>
              </div>
              <p className="text-[17px] font-bold text-slate-900 dark:text-slate-100">{best.keyword}</p>
              <p className="text-[30px] font-extrabold text-green-500 leading-none my-2">{fmt(best.sellerPerOrder)}</p>
              <p className="text-[12px] text-slate-500">seller/order · lowest competition intensity</p>
            </div>
          )}
          {worst && (
            <div className="rounded-2xl border border-red-400/25 bg-white dark:bg-slate-800 outline-none p-5">
              <div className="flex items-center gap-2 mb-[10px]">
                <TrendingUp size={16} color="#f87171" />
                <span className="text-[11px] font-bold tracking-[0.1em] text-red-400 uppercase">Most Saturated</span>
              </div>
              <p className="text-[17px] font-bold text-slate-900 dark:text-slate-100">{worst.keyword}</p>
              <p className="text-[30px] font-extrabold text-red-400 leading-none my-2">{fmt(worst.sellerPerOrder)}</p>
              <p className="text-[12px] text-slate-500">seller/order · high competition intensity</p>
            </div>
          )}
        </div>
      )}

      {history.length === 0 && (
        <p className="text-center text-slate-500 py-12 text-[13px]">Save some analyses first.</p>
      )}
    </div>
  );
}
