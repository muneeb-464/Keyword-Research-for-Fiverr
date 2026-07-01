import { useState, useCallback } from "react";
import { Plus, Save, Download, X, Search, Trash2, Star, BarChart2, Zap, FileDown, Activity, DollarSign } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Badge }    from "../components/Badge";
import { StatCard } from "../components/StatCard";
import { KLabel }   from "../components/KLabel";
import { KInput }   from "../components/KInput";
import { RowMenu }  from "../components/RowMenu";
import { KeywordDetailModal } from "../components/KeywordDetailModal";
import { fmt, uid, fmtDate, calcSPO, calcAvg, spoColor, trendTag, trendMeta } from "../utils";
import type { Record_, Saved_, SortKey, Theme } from "../types";

export function AnalyzerPage({ history, onSave, onDeleteRecord, onStar, onResetHistory, theme,
  keyword, setKeyword, compRaw, setCompRaw, queue, setQueue, avgPriceRaw, setAvgPriceRaw,
}: {
  history: Record_[]; onSave: (r: Record_) => void;
  onDeleteRecord: (id: string) => void;
  onStar: (k: Saved_) => void; onResetHistory: () => void; theme: Theme;
  keyword: string; setKeyword: (v: string) => void;
  compRaw: string; setCompRaw: (v: string) => void;
  queue: number[]; setQueue: React.Dispatch<React.SetStateAction<number[]>>;
  avgPriceRaw: string; setAvgPriceRaw: (v: string) => void;
}) {
  const [qInput, setQInput]         = useState("");
  const [pinned, setPinned]         = useState<Record_ | null>(null);
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null);
  const [sortKey, setSortKey]       = useState<SortKey>("date");
  const [search, setSearch]         = useState("");
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editDraft, setEditDraft]   = useState("");
  const [detailKeyword, setDetailKeyword] = useState<string | null>(null);
  const MAX_Q = 20;

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok }); setTimeout(() => setToast(null), 2200);
  };

  const comp      = parseInt(compRaw.replace(/,/g, ""), 10) || 0;
  const queueSum  = queue.reduce((a, b) => a + b, 0);
  const avgOrders = calcAvg(queueSum);
  const spo       = calcSPO(comp, queueSum);
  const avgPrice  = parseFloat(avgPriceRaw.replace(/,/g, "")) || 0;

  const addQ = () => {
    if (queue.length >= MAX_Q) return showToast(`Max ${MAX_Q} inputs allowed`, false);
    const n = parseInt(qInput, 10);
    if (!isNaN(n) && n > 0) { setQueue(q => [...q, n]); setQInput(""); }
  };

  const buildRec = useCallback((): Record_ | null => {
    if (!keyword.trim() || !comp || queueSum === 0) return null;
    return { id: uid(), keyword: keyword.trim(), competition: comp, queueSum, avgOrders, sellerPerOrder: spo, date: fmtDate(), avgPrice };
  }, [keyword, comp, queueSum, avgOrders, spo, avgPrice]);

  // previous (older) snapshot of the same keyword, keyed by record id — used for trend tagging
  const prevByIdMap = new Map<string, Record_ | null>();
  {
    const byKeyword = new Map<string, Record_[]>();
    history.forEach(r => {
      const arr = byKeyword.get(r.keyword) ?? [];
      arr.push(r);
      byKeyword.set(r.keyword, arr);
    });
    byKeyword.forEach(arr => {
      arr.forEach((r, i) => prevByIdMap.set(r.id, arr[i + 1] ?? null));
    });
  }

  const handleSave = () => {
    const r = buildRec();
    if (!r) return showToast("Fill keyword, competition & at least one order", false);
    onSave(r); setPinned(r); showToast("Analysis saved!");
  };

  const downloadCSV = (records: Record_[], filename: string) => {
    const rows = [
      ["Keyword", "Competition", "Queue Sum", "Avg Orders", "Avg Price", "Seller Per Order", "Date"],
      ...records.map(r => [r.keyword, r.competition, r.queueSum, r.avgOrders, r.avgPrice, r.sellerPerOrder, r.date]),
    ];
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" })),
      download: filename,
    });
    a.click(); URL.revokeObjectURL(a.href);
  };

  const handleCSV = () => {
    const r = pinned ?? buildRec();
    if (!r) return showToast("Save an analysis first before downloading", false);
    downloadCSV([r], `${r.keyword.replace(/\s+/g, "-")}.csv`);
    showToast("Current analysis downloaded!");
  };

  const handleExportAll = () => {
    if (history.length === 0) return showToast("No history to export", false);
    downloadCSV(history, "keyword-research-all.csv");
    showToast(`Exported ${history.length} records!`);
  };

  const display  = pinned ?? history[0] ?? null;
  const altRow   = theme === "dark" ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)";
  const rowHov   = theme === "dark" ? "rgba(255,255,255,0.03)"  : "rgba(0,0,0,0.02)";
  const tdColor  = theme === "dark" ? "#e2e8f0" : "#0f172a";

  const filtered = history
    .filter(r => r.keyword.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "competition")    return b.competition - a.competition;
      if (sortKey === "sellerPerOrder") return a.sellerPerOrder - b.sellerPerOrder;
      return 0;
    });

  return (
    <div className="flex flex-col md:flex-row gap-5 items-start">

      {/* Center column */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">

        {/* Input card */}
        <div className="rounded-2xl border bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:shadow-none outline-none p-[22px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-[18px]">
            <div>
              <KLabel>Keyword</KLabel>
              <KInput theme={theme} placeholder="e.g. Logo Design" value={keyword} onChange={e => setKeyword(e.target.value)} />
            </div>
            <div>
              <KLabel>Competition</KLabel>
              <KInput theme={theme} placeholder="e.g. 24500" value={compRaw} onChange={e => setCompRaw(e.target.value)} />
            </div>
            <div>
              <KLabel>Avg Price ($)</KLabel>
              <KInput theme={theme} placeholder="e.g. 45" value={avgPriceRaw} onChange={e => setAvgPriceRaw(e.target.value)} />
            </div>
          </div>

          {/* Order queue */}
          <div className="mb-[18px]">
            <div className="flex justify-between items-center mb-[7px]">
              <KLabel>Order Queue</KLabel>
              <span className={`text-[11px] font-semibold ${queue.length >= MAX_Q ? "text-red-400" : "text-slate-500"}`}>
                {queue.length} / {MAX_Q} slots used
              </span>
            </div>
            <div className="flex flex-wrap gap-2 items-center min-h-[38px]">
              {queue.map((v, i) => (
                <span key={i} className="inline-flex items-center gap-[5px] bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-[10px] py-[5px] text-[13px] font-semibold text-slate-900 dark:text-slate-200">
                  {v}
                  <button
                    onClick={() => setQueue(q => q.filter((_, j) => j !== i))}
                    className="bg-transparent border-0 cursor-pointer text-slate-500 flex p-0 leading-none hover:text-red-400"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              {queue.length < MAX_Q && (
                <div className="flex gap-[6px]">
                  <input
                    value={qInput} onChange={e => setQInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addQ()} placeholder="Add"
                    className="w-14 text-center rounded-lg px-2 py-[5px] text-[13px] outline-none border border-dashed border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200"
                  />
                  <button
                    onClick={addQ}
                    className="w-8 h-8 flex items-center justify-center bg-transparent border border-dashed border-slate-400 dark:border-slate-500 rounded-lg text-slate-500 cursor-pointer hover:text-blue-500 hover:border-blue-500"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live formula preview */}
          {queueSum > 0 && comp > 0 && (
            <div className="bg-blue-500/[0.06] border border-blue-500/20 rounded-[10px] px-[14px] py-3 flex gap-6 flex-wrap mb-4 text-[13px]">
              <div>
                <span className="text-slate-500">Queue Sum </span>
                <span className="font-bold text-slate-900 dark:text-slate-200">{queueSum}</span>
              </div>
              <div>
                <span className="text-slate-500">÷ 20 = Avg </span>
                <span className="font-bold text-slate-900 dark:text-slate-200">{avgOrders}</span>
              </div>
              <div>
                <span className="text-slate-500">{fmt(comp)} ÷ {avgOrders} = </span>
                <span className="font-extrabold text-[15px]" style={{ color: spoColor(spo, theme) }}>{fmt(spo)}</span>
                <span className="ml-[6px]"><Badge v={spo} theme={theme} /></span>
              </div>
              {avgPrice > 0 && (
                <div>
                  <span className="text-slate-500">Avg Price </span>
                  <span className="font-bold text-slate-900 dark:text-slate-200">${fmt(avgPrice)}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-[13px] py-[11px] rounded-[10px] border-0 cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              <Save size={15} /> Save Analysis
            </button>
            <button
              onClick={handleCSV}
              className="flex-1 flex items-center justify-center gap-2 bg-transparent hover:bg-blue-500/[0.06] text-blue-500 font-semibold text-[13px] py-[11px] rounded-[10px] border border-blue-500/35 cursor-pointer"
            >
              <Download size={15} /> Download This
            </button>
          </div>
        </div>

        {/* History table */}
        <div className="rounded-2xl border bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:shadow-none outline-none">
          <div className="px-[18px] py-[14px] border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-[10px]">
                <span className="text-[15px] font-bold text-slate-900 dark:text-slate-100">Analysis History</span>
                {history.length > 0 && (
                  <button
                    onClick={() => { if (window.confirm(`Reset all ${history.length} records? Order Queue will stay intact.`)) onResetHistory(); }}
                    className="flex items-center gap-[5px] text-[11px] font-semibold px-[9px] py-[3px] rounded-md border border-red-400/35 bg-transparent text-red-400 cursor-pointer hover:bg-red-400/[0.08]"
                  >
                    <Trash2 size={11} /> Reset History
                  </button>
                )}
              </div>
              <div className="flex gap-2 items-center">
                {(["date", "competition", "sellerPerOrder"] as SortKey[]).map(k => (
                  <button key={k} onClick={() => setSortKey(k)}
                    className={[
                      "text-[11px] font-semibold px-[10px] py-1 rounded-md border cursor-pointer",
                      sortKey === k
                        ? "border-blue-500 bg-blue-500/10 text-blue-500"
                        : "border-slate-200 dark:border-slate-700 bg-transparent text-slate-500",
                    ].join(" ")}>
                    {k === "date" ? "Recent" : k === "competition" ? "Competition ↓" : "Best SPO ↑"}
                  </button>
                ))}
                <button
                  onClick={handleExportAll}
                  className="flex items-center gap-[5px] text-[11px] font-semibold px-[10px] py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 cursor-pointer hover:text-blue-500 hover:border-blue-500"
                >
                  <FileDown size={12} /> Export All
                </button>
              </div>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-[11px] top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                placeholder="Search keyword..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-8 pr-3 text-[13px] text-slate-900 dark:text-slate-200 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[580px]">
              <thead className="sticky top-0 z-10 bg-white dark:bg-slate-800">
                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                  {["Keyword", "Competition", "Queue Sum", "Avg Orders", "Avg Price", "Seller / Order", "Trend", "Date", ""].map((h, i) => (
                    <th key={i} className="text-left px-4 py-[11px] text-[11px] font-bold tracking-[0.08em] text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="text-center text-slate-500 py-[40px] text-[13px]">No records found.</td></tr>
                ) : filtered.map((r, idx) => {
                  const isEditing = editingId === r.id;
                  const isStarred = starredIds.has(r.id);
                  return (
                    <tr key={r.id}
                      style={{ background: idx % 2 === 0 ? "transparent" : altRow, borderBottom: `1px solid ${theme === "dark" ? "#1e293b" : "#f1f5f9"}` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = rowHov; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = idx % 2 === 0 ? "transparent" : altRow; }}>
                      <td className="px-4 py-[10px] text-[13px] font-semibold" style={{ color: tdColor }}>
                        {isEditing ? (
                          <div className="flex gap-[6px]">
                            <input autoFocus value={editDraft} onChange={e => setEditDraft(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === "Enter") { onSave({ ...r, keyword: editDraft.trim() || r.keyword }); setEditingId(null); }
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              className="flex-1 border border-blue-500 rounded-md px-2 py-1 text-[13px] outline-none"
                              style={{ background: theme === "dark" ? "#0f172a" : "#f1f5f9", color: tdColor }}
                            />
                            <button onClick={() => { onSave({ ...r, keyword: editDraft.trim() || r.keyword }); setEditingId(null); }}
                              className="bg-blue-500 border-0 rounded-md text-white px-[10px] py-1 text-[12px] font-bold cursor-pointer">✓</button>
                            <button onClick={() => setEditingId(null)}
                              className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 px-2 py-1 text-[12px] cursor-pointer">✕</button>
                          </div>
                        ) : r.keyword}
                      </td>
                      <td className="px-4 py-3 text-[13px] tabular-nums text-slate-500 dark:text-slate-400">{fmt(r.competition)}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-500 dark:text-slate-400">{r.queueSum}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-500 dark:text-slate-400">{r.avgOrders}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-500 dark:text-slate-400">{r.avgPrice ? `$${fmt(r.avgPrice)}` : "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-[6px] flex-wrap">
                          <span className="text-[14px] font-extrabold tabular-nums" style={{ color: spoColor(r.sellerPerOrder, theme) }}>{fmt(r.sellerPerOrder)}</span>
                          <Badge v={r.sellerPerOrder} theme={theme} />
                          <Badge v={r.sellerPerOrder} theme={theme} showAdvice />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {(() => {
                          const p = prevByIdMap.get(r.id);
                          if (!p) return <span className="text-[11px] font-semibold px-[9px] py-[3px] rounded-md bg-slate-100 dark:bg-slate-900 text-slate-500">New</span>;
                          const t = trendTag(p, r);
                          const m = trendMeta(t);
                          return (
                            <span className="text-[11px] font-bold px-[9px] py-[3px] rounded-md" style={{ background: `${m.color}1a`, color: m.color }}>
                              {m.label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-slate-500 whitespace-nowrap">{r.date}</td>
                      <td className="px-[10px] py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setDetailKeyword(r.keyword)}
                            title="View trend history"
                            className="bg-transparent border-0 cursor-pointer flex p-1 rounded-md text-slate-500 hover:text-blue-500"
                          >
                            <Activity size={14} />
                          </button>
                          <button
                            onClick={() => { onStar({ id: uid(), keyword: r.keyword, competition: r.competition, sellerPerOrder: r.sellerPerOrder, savedAt: fmtDate() }); setStarredIds(s => new Set([...s, r.id])); }}
                            title={isStarred ? "Saved!" : "Save keyword"}
                            className="bg-transparent border-0 cursor-pointer flex p-1 rounded-md"
                            style={{ color: isStarred ? "#f59e0b" : "#475569" }}
                            onMouseEnter={e => { if (!isStarred) e.currentTarget.style.color = "#f59e0b"; }}
                            onMouseLeave={e => { if (!isStarred) e.currentTarget.style.color = "#475569"; }}>
                            <Star size={14} fill={isStarred ? "#f59e0b" : "none"} />
                          </button>
                          <RowMenu record={r} theme={theme}
                            onDelete={() => onDeleteRecord(r.id)}
                            onDuplicate={() => onSave({ ...r, id: uid(), date: fmtDate() })}
                            onEdit={() => { setEditingId(r.id); setEditDraft(r.keyword); }}
                            onExport={() => {
                              const csv = `Keyword,Competition,Queue Sum,Avg Orders,Avg Price,Seller Per Order,Date\n${r.keyword},${r.competition},${r.queueSum},${r.avgOrders},${r.avgPrice},${r.sellerPerOrder},${r.date}`;
                              const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: `${r.keyword}.csv` });
                              a.click();
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-[10px] border-t border-slate-100 dark:border-slate-800">
            <span className="text-[12px] text-slate-500">{filtered.length} of {history.length} records</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-[290px] shrink-0 flex flex-col gap-[14px]">
        <div className="rounded-2xl border bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:shadow-none outline-none p-5">
          <p className="text-[10px] font-bold tracking-[0.1em] text-slate-500 uppercase mb-[6px]">Current Keyword</p>
          <p className="text-[15px] font-bold text-slate-900 dark:text-slate-100 mb-3 leading-[1.3]">
            {display?.keyword || "—"}
          </p>
          <div className="flex flex-col gap-[10px]">
            <StatCard label="Competition"      value={display?.competition ?? 0}    theme={theme} icon={<BarChart2 size={14}/>} />
            <StatCard label="Avg Orders"       value={display?.avgOrders ?? 0}      theme={theme} icon={<TrendingUp size={14}/>} />
            <StatCard label="Avg Price"        value={display?.avgPrice ?? 0}       theme={theme} icon={<DollarSign size={14}/>} />
            <StatCard label="Seller Per Order" value={display?.sellerPerOrder ?? 0} theme={theme} accent note="Lower is better (Market intensity)" icon={<Zap size={14}/>} />
          </div>
        </div>

        <div className="rounded-2xl border bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:shadow-none outline-none p-4">
          <p className="text-[10px] font-bold tracking-[0.1em] text-slate-500 uppercase mb-2">Formula</p>
          <div className="text-[12px] text-slate-500 leading-[1.8] mb-[10px]">
            <p>① Sum queue numbers (max 20)</p>
            <p>② Avg = Sum ÷ <strong className="text-blue-500">20</strong></p>
            <p>③ SPO = Competition ÷ Avg</p>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700 mb-[10px]" />
          <p className="text-[10px] font-bold tracking-[0.1em] text-slate-500 uppercase mb-2">Fiverr Criteria</p>
          {([
            ["#22c55e", "0 – 300",     "Excellent",   "Create Gig Immediately"],
            ["#10b981", "300 – 600",   "Very Strong", "High Potential"],
            ["#f59e0b", "600 – 1200",  "Good",        "Can Work"],
            ["#f97316", "1200 – 2500", "Medium",      "Needs Strong SEO"],
            ["#ef4444", "2500 – 4000", "Hard",        "Avoid if Beginner"],
            ["#dc2626", "4000+",       "Very Hard",   "Avoid"],
          ] as [string, string, string, string][]).map(([c, range, label, advice]) => (
            <div key={range} className="flex items-center gap-2 py-[5px] border-b border-slate-100 dark:border-slate-800">
              <span className="w-2 h-2 rounded-[2px] shrink-0" style={{ background: c }} />
              <span className="text-[11px] font-bold w-[72px] shrink-0" style={{ color: c }}>{range}</span>
              <div className="flex-1">
                <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-200">{label}</span>
                <span className="text-[10px] text-slate-500 ml-1">· {advice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={[
          "fixed bottom-6 left-1/2 -translate-x-1/2 text-[13px] font-medium px-5 py-[10px] rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.4)] z-[9999] whitespace-nowrap border",
          toast.ok
            ? "bg-slate-800 border-blue-500/30 text-slate-200"
            : "bg-[#2d0f0f] border-red-400/30 text-red-400",
        ].join(" ")}>
          {toast.msg}
        </div>
      )}

      {detailKeyword && (
        <KeywordDetailModal
          keyword={detailKeyword}
          history={history}
          theme={theme}
          onClose={() => setDetailKeyword(null)}
        />
      )}
    </div>
  );
}
