import { spoColor, spoLabel, spoAdvice } from "../utils";
import type { Theme } from "../types";

export function Badge({ v, theme, showAdvice }: { v: number; theme: Theme; showAdvice?: boolean }) {
  const c = spoColor(v, theme);
  const l = spoLabel(v);
  if (!l) return null;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
      background: c + "22", color: c, border: `1px solid ${c}50`,
      whiteSpace: "nowrap",
    }}>
      {showAdvice ? spoAdvice(v) : l}
    </span>
  );
}
