import { useState, useEffect } from "react";
import { Star, Edit3, Trash2, FileDown } from "lucide-react";
import { Badge }  from "../components/Badge";
import { fmt, spoColor } from "../utils";
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

  const sorted  = [...history].sort((a, b) => a.sellerPerOrder - b.sellerPerOrder);
  const altRow  = theme === "dark" ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)";
  const rowHov  = theme === "dark" ? "rgba(255,255,255,0.03)"  : "rgba(0,0,0,0.02)";
  const tdColor = theme === "dark" ? "#e2e8f0" : "#0f172a";

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
    <div className="rounded-2xl border bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:shadow-none outline-none">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div>
          <p className="text-[15px] font-bold text-slate-900 dark:text-slate-100">Order Queue</p>
          <p className="text-[12px] text-slate-500 mt-[3px]">
            All-time keywords · {history.length} total · Ranked best → worst · Never resets
          </p>
        </div>
        <button
          onClick={downloadAll}
          className="flex items-center gap-[6px] text-[12px] font-semibold px-[14px] py-[7px] rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 cursor-pointer hover:text-blue-500 hover:border-blue-500"
        >
          <FileDown size={13} /> Download All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead className="sticky top-0 z-10 bg-white dark:bg-slate-800">
            <tr className="border-b-2 border-slate-200 dark:border-slate-700">
              {["#", "Keyword", "Competition", "Queue Sum", "Avg Orders", "Seller/Order", "Date", ""].map(h => (
                <th key={h} className="text-left px-4 py-[11px] text-[11px] font-bold tracking-[0.08em] text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan={8} className="text-center text-slate-500 py-[40px] text-[13px]">No data yet.</td></tr>
            )}
            {sorted.map((r, i) => {
              const isStarred = starredIds.has(r.id);
              const isEditing = editingId === r.id;
              return (
                <tr key={r.id}
                  style={{ background: i % 2 === 0 ? "transparent" : altRow, borderBottom: `1px solid ${theme === "dark" ? "#1e293b" : "#f1f5f9"}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = rowHov; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "transparent" : altRow; }}>
                  <td className="px-4 py-3 text-slate-600 text-[12px] font-semibold">{i + 1}</td>
                  <td className="px-4 py-[10px] text-[13px] font-semibold" style={{ color: tdColor }}>
                    {isEditing ? (
                      <div className="flex gap-[6px]">
                        <input autoFocus value={editDraft} onChange={e => setEditDraft(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") confirmEdit(r); if (e.key === "Escape") setEditingId(null); }}
                          className="flex-1 rounded-md px-2 py-1 text-[13px] outline-none border border-blue-500"
                          style={{ background: theme === "dark" ? "#0f172a" : "#f1f5f9", color: tdColor }}
                        />
                        <button onClick={() => confirmEdit(r)} className="bg-blue-500 border-0 rounded-md text-white px-[10px] py-1 text-[12px] font-bold cursor-pointer">✓</button>
                        <button onClick={() => setEditingId(null)} className="bg-transparent border border-slate-700 dark:border-slate-700 rounded-md text-slate-500 px-2 py-1 text-[12px] cursor-pointer">✕</button>
                      </div>
                    ) : (
                      <span className="flex items-center gap-[6px]">
                        {isStarred && <Star size={11} fill="#f59e0b" color="#f59e0b" />}
                        {r.keyword}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[13px] tabular-nums text-slate-500 dark:text-slate-400">{fmt(r.competition)}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-500 dark:text-slate-400">{r.queueSum}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-500 dark:text-slate-400">{r.avgOrders}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-extrabold tabular-nums" style={{ color: spoColor(r.sellerPerOrder, theme) }}>{fmt(r.sellerPerOrder)}</span>
                      <Badge v={r.sellerPerOrder} theme={theme} />
                      <Badge v={r.sellerPerOrder} theme={theme} showAdvice />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="px-[10px] py-3">
                    <div className="flex items-center gap-[2px]">
                      <button
                        onClick={() => setStarredIds(s => { const n = new Set(s); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; })}
                        title={isStarred ? "Unstar" : "Star"}
                        className="bg-transparent border-0 cursor-pointer flex p-1 rounded-md"
                        style={{ color: isStarred ? "#f59e0b" : "#475569" }}
                        onMouseEnter={e => { if (!isStarred) e.currentTarget.style.color = "#f59e0b"; }}
                        onMouseLeave={e => { if (!isStarred) e.currentTarget.style.color = "#475569"; }}>
                        <Star size={14} fill={isStarred ? "#f59e0b" : "none"} />
                      </button>
                      <button onClick={() => { setEditingId(r.id); setEditDraft(r.keyword); }} title="Edit keyword"
                        className="bg-transparent border-0 cursor-pointer flex p-1 rounded-md text-slate-600 hover:text-blue-500">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => onDelete(r.id)} title="Delete"
                        className="bg-transparent border-0 cursor-pointer flex p-1 rounded-md text-slate-600 hover:text-red-400">
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
        <div className="px-4 py-[10px] border-t border-slate-100 dark:border-slate-800">
          <span className="text-[12px] text-slate-500">{history.length} keywords in queue · {[...starredIds].length} starred</span>
        </div>
      )}
    </div>
  );
}
