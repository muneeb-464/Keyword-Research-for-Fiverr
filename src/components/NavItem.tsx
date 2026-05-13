import { useState } from "react";
import type { Theme } from "../types";

export function NavItem({ icon, label, active, onClick, theme }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; theme: Theme;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
        fontSize: 13, fontWeight: active ? 600 : 500, textAlign: "left",
        background: active ? "rgba(59,130,246,0.12)" : hov ? (theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)") : "transparent",
        color: active ? "#3b82f6" : hov ? (theme === "dark" ? "#e2e8f0" : "#0f172a") : "#64748b",
        borderLeft: active ? "2px solid #3b82f6" : "2px solid transparent",
        outline: "none",
      }}>
      {icon} {label}
    </button>
  );
}
