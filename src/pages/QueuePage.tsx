import { useState, useEffect } from "react";
import { Star, Edit3, Trash2, FileDown } from "lucide-react";
import { Badge }  from "../components/Badge";
import { fmt, spoColor, card } from "../utils";
import { loadStarred, saveStarred } from "../storage";
import type { Record_, Theme } from "../types";

export function QueuePage({ history, onDelete, onEdit, theme }: {
  history: Record_[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newKeyword: string) => void;
  theme: Theme;
}) {
  const [starredIds, setStarredIds] = useState<Set<string>>(loadStarred);
  useEffect(() => { saveStarred(starredIds); }, [starredIds]);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editDraft, setEditDraft]   = useState("");

  const sorted   = [...history].sort((a, b) => a.sellerPerOrder - b.sellerPerOrder);
  const tdColor  = theme === "dark" ? "#e2e8f0" : "#0f172a";
  const subColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const altRow   = theme === "dark" ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)";
  const rowHov   = theme === "dark" ? "rgba(255,255,255,0.03)"  : "rgba(0,0,0,0.02)";

  const downloadAll = () => {
    const rows = [
      ["Keyword", "Competition", "Queue Sum", "Avg Orders", "Seller Per Order", "Date"],
      ...sorted.map(r => [r.keyword, r.competition, r.queueSum, r.avgOrders, r.sellerPerOrder, r.date]),
    ];
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" })),
      download: "order-queue-all.csv",
    });
    a.click(); URL.revokeObjectURL(a.href);
  };

  const confirmEdit = (r: Record_) => {
    const trimmed = editDraft.trim();
    if (trimmed && trimmed !== r.keyword) onEdit(r.id, trimmed);
    setEditingId(null);
  };

  return (
    <div style={{ ...card(theme) }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: theme === "dark" ? "#f1f5f9" : "#0f172a" }}>Order Queue</p>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>
            All-time keywords · {history.length} total · Ranked best → worst · Never resets
          </p>
        </div>
        <button onClick={downloadAll}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 8, border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`, background: "transparent", color: "#64748b", cursor: "pointer" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#3b82f6"; e.currentTarget.style.borderColor = "#3b82f6"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = theme === "dark" ? "#334155" : "#e2e8f0"; }}>
          <FileDown size={13} /> Download All
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: theme === "dark" ? "#1e293b" : "#ffffff" }}>
            <tr style={{ borderBottom: `2px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}` }}>
              {["#", "Keyword", "Competition", "Queue Sum", "Avg Orders", "Seller/Order", "Date", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: theme === "dark" ? "#94a3b8" : "#475569", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "#64748b", padding: "40px 0", fontSize: 13 }}>No data yet.</td></tr>
            )}
            {sorted.map((r, i) => {
              const isStarred = starredIds.has(r.id);
              const isEditing = editingId === r.id;
              return (
                <tr key={r.id}
                  style={{ background: i % 2 === 0 ? "transparent" : altRow, borderBottom: `1px solid ${theme === "dark" ? "#1e293b" : "#f1f5f9"}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = rowHov; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "transparent" : altRow; }}>
                  <td style={{ padding: "12px 16px", color: "#475569", fontSize: 12, fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 600, color: tdColor }}>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <input autoFocus value={editDraft} onChange={e => setEditDraft(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") confirmEdit(r); if (e.key === "Escape") setEditingId(null); }}
                          style={{ flex: 1, background: theme === "dark" ? "#0f172a" : "#f1f5f9", border: "1px solid #3b82f6", borderRadius: 6, padding: "4px 8px", fontSize: 13, color: tdColor, outline: "none" }}
                        />
                        <button onClick={() => confirmEdit(r)} style={{ background: "#3b82f6", border: "none", borderRadius: 6, color: "#fff", padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✓</button>
                        <button onClick={() => setEditingId(null)} style={{ background: "none", border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`, borderRadius: 6, color: "#64748b", padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>✕</button>
                      </div>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {isStarred && <Star size={11} fill="#f59e0b" color="#f59e0b" />}
                        {r.keyword}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: subColor, fontVariantNumeric: "tabular-nums" }}>{fmt(r.competition)}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: subColor }}>{r.queueSum}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: subColor }}>{r.avgOrders}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: spoColor(r.sellerPerOrder, theme), fontVariantNumeric: "tabular-nums" }}>{fmt(r.sellerPerOrder)}</span>
                      <Badge v={r.sellerPerOrder} theme={theme} />
                      <Badge v={r.sellerPerOrder} theme={theme} showAdvice />
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{r.date}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <button onClick={() => setStarredIds(s => { const n = new Set(s); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; })}
                        title={isStarred ? "Unstar" : "Star"}
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4, borderRadius: 6, color: isStarred ? "#f59e0b" : "#475569" }}
                        onMouseEnter={e => { if (!isStarred) e.currentTarget.style.color = "#f59e0b"; }}
                        onMouseLeave={e => { if (!isStarred) e.currentTarget.style.color = "#475569"; }}>
                        <Star size={14} fill={isStarred ? "#f59e0b" : "none"} />
                      </button>
                      <button onClick={() => { setEditingId(r.id); setEditDraft(r.keyword); }} title="Edit keyword"
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4, borderRadius: 6, color: "#475569" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#3b82f6"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#475569"; }}>
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => onDelete(r.id)} title="Delete"
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4, borderRadius: 6, color: "#475569" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#475569"; }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {history.length > 0 && (
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${theme === "dark" ? "#334155" : "#f1f5f9"}` }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>{history.length} keywords in queue · {[...starredIds].length} starred</span>
        </div>
      )}
    </div>
  );
}
