import { Trash2 } from "lucide-react";
import { Badge }  from "../components/Badge";
import { fmt, spoColor, card } from "../utils";
import type { Saved_, Theme } from "../types";

export function SavedPage({ saved, onDelete, theme }: {
  saved: Saved_[]; onDelete: (id: string) => void; theme: Theme;
}) {
  return (
    <div style={{ ...card(theme) }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}` }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: theme === "dark" ? "#f1f5f9" : "#0f172a" }}>Saved Keywords</p>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{saved.length} keywords saved</p>
      </div>
      {saved.length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748b", padding: "48px 0", fontSize: 13 }}>
          Click ★ on any row in Analyzer to save keywords here.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, padding: 20 }}>
          {saved.map(k => (
            <div key={k.id} style={{ background: theme === "dark" ? "#0f172a" : "#f8fafc", border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: theme === "dark" ? "#f1f5f9" : "#0f172a" }}>{k.keyword}</p>
                <button onClick={() => onDelete(k.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#475569"; }}>
                  <Trash2 size={14} />
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>Competition: {fmt(k.competition)}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: spoColor(k.sellerPerOrder, theme) }}>{fmt(k.sellerPerOrder)}</span>
                <Badge v={k.sellerPerOrder} theme={theme} />
              </div>
              <p style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>{k.savedAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
