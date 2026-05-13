import { useState, useEffect, useRef } from "react";
import { Edit3, Copy, FileDown, Trash2 } from "lucide-react";
import type { Record_, Theme } from "../types";

export function RowMenu({ record, onDelete, onDuplicate, onExport, onEdit, theme }: {
  record: Record_; onDelete: () => void; onDuplicate: () => void;
  onExport: () => void; onEdit: () => void; theme: Theme;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const menuBg  = theme === "dark" ? "#1e293b" : "#ffffff";
  const menuBdr = theme === "dark" ? "#334155" : "#e2e8f0";
  const items = [
    { icon: <Edit3 size={13}/>,    label: "Edit",       danger: false, action: () => { onEdit();      setOpen(false); } },
    { icon: <Copy size={13}/>,     label: "Duplicate",  danger: false, action: () => { onDuplicate(); setOpen(false); } },
    { icon: <FileDown size={13}/>, label: "Export Row", danger: false, action: () => { onExport();    setOpen(false); } },
    { icon: <Trash2 size={13}/>,   label: "Delete",     danger: true,  action: () => { onDelete();    setOpen(false); } },
  ];

  // suppress unused warning — record is kept for potential future use
  void record;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "4px 6px", borderRadius: 6, display: "flex" }}>
        ···
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 100, background: menuBg, border: `1px solid ${menuBdr}`, borderRadius: 10, boxShadow: "0 10px 40px rgba(0,0,0,0.3)", minWidth: 150, overflow: "hidden" }}>
          {items.map(item => (
            <button key={item.label} onClick={item.action}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: item.danger ? "#f87171" : (theme === "dark" ? "#e2e8f0" : "#0f172a"), textAlign: "left" }}
              onMouseEnter={e => { e.currentTarget.style.background = theme === "dark" ? "#334155" : "#f1f5f9"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
