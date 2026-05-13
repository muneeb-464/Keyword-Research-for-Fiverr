import { useState, useCallback, useEffect } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { Plus, Save, Download, X, Search, Trash2, Star, BarChart2, Zap, FileDown } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { loadStarred, saveStarred } from "../storage";
import { Badge }    from "../components/Badge";
import { StatCard } from "../components/StatCard";
import { KLabel }   from "../components/KLabel";
import { KInput }   from "../components/KInput";
import { RowMenu }  from "../components/RowMenu";
import { fmt, uid, fmtDate, calcSPO, calcAvg, spoColor, card } from "../utils";
import type { Record_, Saved_, SortKey, Theme } from "../types";

export function AnalyzerPage({ history, onSave, onDeleteRecord, onStar, onResetHistory, theme,
  keyword, setKeyword, compRaw, setCompRaw, queue, setQueue,
}: {
  history: Record_[]; onSave: (r: Record_) => void;
  onDeleteRecord: (id: string) => void;
  onStar: (k: Saved_) => void; onResetHistory: () => void; theme: Theme;
  keyword: string; setKeyword: (v: string) => void;
  compRaw: string; setCompRaw: (v: string) => void;
  queue: number[]; setQueue: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const isMobile = useIsMobile();
  const [qInput, setQInput]         = useState("");
  const [pinned, setPinned]         = useState<Record_ | null>(null);
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null);
  const [sortKey, setSortKey]       = useState<SortKey>("date");
  const [search, setSearch]         = useState("");
  const [starredIds, setStarredIds] = useState<Set<string>>(loadStarred);
  useEffect(() => { saveStarred(starredIds); }, [starredIds]);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editDraft, setEditDraft]   = useState("");
  const MAX_Q = 20;

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok }); setTimeout(() => setToast(null), 2200);
  };

  const comp      = parseInt(compRaw.replace(/,/g, ""), 10) || 0;
  const queueSum  = queue.reduce((a, b) => a + b, 0);
  const avgOrders = calcAvg(queueSum);
  const spo       = calcSPO(comp, queueSum);

  const addQ = () => {
    if (queue.length >= MAX_Q) return showToast(`Max ${MAX_Q} inputs allowed`, false);
    const n = parseInt(qInput, 10);
    if (!isNaN(n) && n > 0) { setQueue(q => [...q, n]); setQInput(""); }
  };

  const buildRec = useCallback((): Record_ | null => {
    if (!keyword.trim() || !comp || queueSum === 0) return null;
    return { id: uid(), keyword: keyword.trim(), competition: comp, queueSum, avgOrders, sellerPerOrder: spo, date: fmtDate() };
  }, [keyword, comp, queueSum, avgOrders, spo]);

  const handleSave = () => {
    const r = buildRec();
    if (!r) return showToast("Fill keyword, competition & at least one order", false);
    onSave(r); setPinned(r); showToast("Analysis saved!");
  };

  const downloadCSV = (records: Record_[], filename: string) => {
    const rows = [
      ["Keyword", "Competition", "Queue Sum", "Avg Orders", "Seller Per Order", "Date"],
      ...records.map(r => [r.keyword, r.competition, r.queueSum, r.avgOrders, r.sellerPerOrder, r.date]),
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
  const tdColor  = theme === "dark" ? "#e2e8f0" : "#0f172a";
  const subColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const thColor  = theme === "dark" ? "#94a3b8" : "#475569";
  const rowHov   = theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  const altRow   = theme === "dark" ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)";

  const filtered = history
    .filter(r => r.keyword.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "competition")    return b.competition - a.competition;
      if (sortKey === "sellerPerOrder") return a.sellerPerOrder - b.sellerPerOrder;
      return 0;
    });

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 20, alignItems: "flex-start" }}>
      {/* Center */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Input card */}
        <div style={{ ...card(theme), padding: 22 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 18 }}>
            <div>
              <KLabel>Keyword</KLabel>
              <KInput theme={theme} placeholder="e.g. Logo Design" value={keyword} onChange={e => setKeyword(e.target.value)} />
            </div>
            <div>
              <KLabel>Competition</KLabel>
              <KInput theme={theme} placeholder="e.g. 24500" value={compRaw} onChange={e => setCompRaw(e.target.value)} />
            </div>
          </div>

          {/* Order queue */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <KLabel>Order Queue</KLabel>
              <span style={{ fontSize: 11, fontWeight: 600, color: queue.length >= MAX_Q ? "#f87171" : "#64748b" }}>
                {queue.length} / {MAX_Q} slots used
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", minHeight: 38 }}>
              {queue.map((v, i) => (
                <span key={i} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: theme === "dark" ? "#0f172a" : "#f1f5f9",
                  border: `1px solid ${theme === "dark" ? "#334155" : "#cbd5e1"}`,
                  borderRadius: 8, padding: "5px 10px", fontSize: 13, fontWeight: 600,
                  color: theme === "dark" ? "#e2e8f0" : "#0f172a",
                }}>
                  {v}
                  <button onClick={() => setQueue(q => q.filter((_, j) => j !== i))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", padding: 0, lineHeight: 0 }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; }}>
                    <X size={11} />
                  </button>
                </span>
              ))}
              {queue.length < MAX_Q && (
                <div style={{ display: "flex", gap: 6 }}>
                  <input value={qInput} onChange={e => setQInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addQ()} placeholder="Add"
                    style={{ width: 56, background: theme === "dark" ? "#0f172a" : "#f8fafc", border: `1px dashed ${theme === "dark" ? "#475569" : "#cbd5e1"}`, borderRadius: 8, padding: "5px 8px", fontSize: 13, color: theme === "dark" ? "#e2e8f0" : "#0f172a", textAlign: "center", outline: "none" }}
                  />
                  <button onClick={addQ}
                    style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: `1px dashed ${theme === "dark" ? "#475569" : "#cbd5e1"}`, borderRadius: 8, color: "#64748b", cursor: "pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#3b82f6"; e.currentTarget.style.borderColor = "#3b82f6"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = theme === "dark" ? "#475569" : "#cbd5e1"; }}>
                    <Plus size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live formula preview */}
          {queueSum > 0 && comp > 0 && (
            <div style={{ background: theme === "dark" ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16, fontSize: 13 }}>
              <div><span style={{ color: "#64748b" }}>Queue Sum </span><span style={{ fontWeight: 700, color: theme === "dark" ? "#e2e8f0" : "#0f172a" }}>{queueSum}</span></div>
              <div><span style={{ color: "#64748b" }}>÷ 20 = Avg </span><span style={{ fontWeight: 700, color: theme === "dark" ? "#e2e8f0" : "#0f172a" }}>{avgOrders}</span></div>
              <div>
                <span style={{ color: "#64748b" }}>{fmt(comp)} ÷ {avgOrders} = </span>
                <span style={{ fontWeight: 800, fontSize: 15, color: spoColor(spo, theme) }}>{fmt(spo)}</span>
                <span style={{ marginLeft: 6 }}><Badge v={spo} theme={theme} /></span>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleSave}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#3b82f6", color: "#fff", fontWeight: 700, fontSize: 13, padding: "11px 0", borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#2563eb"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#3b82f6"; }}>
              <Save size={15} /> Save Analysis
            </button>
            <button onClick={handleCSV}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", color: "#3b82f6", fontWeight: 600, fontSize: 13, padding: "11px 0", borderRadius: 10, border: "1px solid rgba(59,130,246,0.35)", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
              <Download size={15} /> Download This
            </button>
          </div>
        </div>

        {/* History table */}
        <div style={{ ...card(theme) }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: theme === "dark" ? "#f1f5f9" : "#0f172a" }}>Analysis History</span>
                {history.length > 0 && (
                  <button
                    onClick={() => { if (window.confirm(`Reset all ${history.length} records? Order Queue will stay intact.`)) onResetHistory(); }}
                    style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6, border: "1px solid rgba(248,113,113,0.35)", background: "transparent", color: "#f87171", cursor: "pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                    <Trash2 size={11} /> Reset History
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {(["date", "competition", "sellerPerOrder"] as SortKey[]).map(k => (
                  <button key={k} onClick={() => setSortKey(k)}
                    style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, border: `1px solid ${sortKey === k ? "#3b82f6" : (theme === "dark" ? "#334155" : "#e2e8f0")}`, background: sortKey === k ? "rgba(59,130,246,0.1)" : "transparent", color: sortKey === k ? "#3b82f6" : "#64748b", cursor: "pointer" }}>
                    {k === "date" ? "Recent" : k === "competition" ? "Competition ↓" : "Best SPO ↑"}
                  </button>
                ))}
                <button onClick={handleExportAll}
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`, background: "transparent", color: "#64748b", cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#3b82f6"; e.currentTarget.style.borderColor = "#3b82f6"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = theme === "dark" ? "#334155" : "#e2e8f0"; }}>
                  <FileDown size={12} /> Export All
                </button>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input placeholder="Search keyword..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", background: theme === "dark" ? "#0f172a" : "#f8fafc", border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`, borderRadius: 8, padding: "8px 12px 8px 32px", fontSize: 13, color: theme === "dark" ? "#e2e8f0" : "#0f172a", outline: "none" }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580 }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10, background: theme === "dark" ? "#1e293b" : "#ffffff" }}>
                <tr style={{ borderBottom: `2px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}` }}>
                  {["Keyword", "Competition", "Queue Sum", "Avg Orders", "Seller / Order", "Date", ""].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: thColor, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", color: "#64748b", padding: "40px 0", fontSize: 13 }}>No records found.</td></tr>
                ) : filtered.map((r, idx) => {
                  const isEditing = editingId === r.id;
                  const isStarred = starredIds.has(r.id);
                  return (
                    <tr key={r.id}
                      style={{ background: idx % 2 === 0 ? "transparent" : altRow, borderBottom: `1px solid ${theme === "dark" ? "#1e293b" : "#f1f5f9"}` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = rowHov; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = idx % 2 === 0 ? "transparent" : altRow; }}>
                      <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 600, color: tdColor }}>
                        {isEditing ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <input autoFocus value={editDraft} onChange={e => setEditDraft(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === "Enter") { onSave({ ...r, keyword: editDraft.trim() || r.keyword }); setEditingId(null); }
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              style={{ flex: 1, background: theme === "dark" ? "#0f172a" : "#f1f5f9", border: "1px solid #3b82f6", borderRadius: 6, padding: "4px 8px", fontSize: 13, color: tdColor, outline: "none" }}
                            />
                            <button onClick={() => { onSave({ ...r, keyword: editDraft.trim() || r.keyword }); setEditingId(null); }}
                              style={{ background: "#3b82f6", border: "none", borderRadius: 6, color: "#fff", padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✓</button>
                            <button onClick={() => setEditingId(null)}
                              style={{ background: "none", border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`, borderRadius: 6, color: "#64748b", padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>✕</button>
                          </div>
                        ) : r.keyword}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: subColor, fontVariantNumeric: "tabular-nums" }}>{fmt(r.competition)}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: subColor }}>{r.queueSum}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: subColor }}>{r.avgOrders}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: spoColor(r.sellerPerOrder, theme), fontVariantNumeric: "tabular-nums" }}>{fmt(r.sellerPerOrder)}</span>
                          <Badge v={r.sellerPerOrder} theme={theme} />
                          <Badge v={r.sellerPerOrder} theme={theme} showAdvice />
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{r.date}</td>
                      <td style={{ padding: "12px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <button
                            onClick={() => { onStar({ id: uid(), keyword: r.keyword, competition: r.competition, sellerPerOrder: r.sellerPerOrder, savedAt: fmtDate() }); setStarredIds(s => new Set([...s, r.id])); }}
                            title={isStarred ? "Saved!" : "Save keyword"}
                            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4, borderRadius: 6, color: isStarred ? "#f59e0b" : "#475569" }}
                            onMouseEnter={e => { if (!isStarred) e.currentTarget.style.color = "#f59e0b"; }}
                            onMouseLeave={e => { if (!isStarred) e.currentTarget.style.color = "#475569"; }}>
                            <Star size={14} fill={isStarred ? "#f59e0b" : "none"} />
                          </button>
                          <RowMenu record={r} theme={theme}
                            onDelete={() => onDeleteRecord(r.id)}
                            onDuplicate={() => onSave({ ...r, id: uid(), date: fmtDate() })}
                            onEdit={() => { setEditingId(r.id); setEditDraft(r.keyword); }}
                            onExport={() => {
                              const csv = `Keyword,Competition,Queue Sum,Avg Orders,Seller Per Order,Date\n${r.keyword},${r.competition},${r.queueSum},${r.avgOrders},${r.sellerPerOrder},${r.date}`;
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
          <div style={{ padding: "10px 16px", borderTop: `1px solid ${theme === "dark" ? "#334155" : "#f1f5f9"}` }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>{filtered.length} of {history.length} records</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: isMobile ? "100%" : 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ ...card(theme), padding: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>Current Keyword</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: theme === "dark" ? "#f1f5f9" : "#0f172a", marginBottom: 16, lineHeight: 1.3 }}>
            {display?.keyword || "—"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <StatCard label="Competition"      value={display?.competition ?? 0}    theme={theme} icon={<BarChart2 size={14}/>} />
            <StatCard label="Avg Orders"       value={display?.avgOrders ?? 0}      theme={theme} icon={<TrendingUp size={14}/>} />
            <StatCard label="Seller Per Order" value={display?.sellerPerOrder ?? 0} theme={theme} accent note="Lower is better (Market intensity)" icon={<Zap size={14}/>} />
          </div>
        </div>

        <div style={{ ...card(theme), padding: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>Formula</p>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.8, marginBottom: 10 }}>
            <p>① Sum queue numbers (max 20)</p>
            <p>② Avg = Sum ÷ <strong style={{ color: "#3b82f6" }}>20</strong></p>
            <p>③ SPO = Competition ÷ Avg</p>
          </div>
          <div style={{ height: 1, background: theme === "dark" ? "#334155" : "#e2e8f0", marginBottom: 10 }} />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>Fiverr Criteria</p>
          {([
            ["#22c55e", "0 – 300",     "Excellent",   "Create Gig Immediately"],
            ["#10b981", "300 – 600",   "Very Strong", "High Potential"],
            ["#f59e0b", "600 – 1200",  "Good",        "Can Work"],
            ["#f97316", "1200 – 2500", "Medium",      "Needs Strong SEO"],
            ["#ef4444", "2500 – 4000", "Hard",        "Avoid if Beginner"],
            ["#dc2626", "4000+",       "Very Hard",   "Avoid"],
          ] as [string, string, string, string][]).map(([c, range, label, advice]) => (
            <div key={range} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: `1px solid ${theme === "dark" ? "#1e293b" : "#f1f5f9"}` }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: c, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: c, width: 72, flexShrink: 0 }}>{range}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: theme === "dark" ? "#e2e8f0" : "#0f172a" }}>{label}</span>
                <span style={{ fontSize: 10, color: "#64748b", marginLeft: 4 }}>· {advice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: toast.ok ? "#1e293b" : "#2d0f0f",
          border: `1px solid ${toast.ok ? "rgba(59,130,246,0.3)" : "rgba(248,113,113,0.3)"}`,
          color: toast.ok ? "#e2e8f0" : "#f87171",
          fontSize: 13, fontWeight: 500, padding: "10px 20px", borderRadius: 10,
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)", zIndex: 9999, whiteSpace: "nowrap",
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
