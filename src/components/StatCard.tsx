import { fmt } from "../utils";
import type { Theme } from "../types";

export function StatCard({ label, value, accent, note, icon, theme }: {
  label: string; value: number | string; accent?: boolean; note?: string;
  icon?: React.ReactNode; theme: Theme;
}) {
  const isGreen  = accent;
  const bg       = isGreen ? (theme === "dark" ? "rgba(34,197,94,0.08)" : "rgba(34,197,94,0.06)") : (theme === "dark" ? "#0f172a" : "#f8fafc");
  const border   = isGreen ? "rgba(34,197,94,0.25)" : (theme === "dark" ? "#334155" : "#e2e8f0");
  const valColor = isGreen ? "#22c55e" : (theme === "dark" ? "#f1f5f9" : "#0f172a");
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#64748b", textTransform: "uppercase" }}>{label}</p>
        {icon && <span style={{ color: isGreen ? "#22c55e" : "#64748b", opacity: 0.7 }}>{icon}</span>}
      </div>
      <p style={{ fontSize: 26, fontWeight: 800, color: valColor, lineHeight: 1 }}>
        {typeof value === "number" ? fmt(value) : value}
      </p>
      {note && <p style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>{note}</p>}
    </div>
  );
}
