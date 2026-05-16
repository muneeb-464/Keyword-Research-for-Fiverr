import { spoColor, spoLabel, spoAdvice } from "../utils";
import type { Theme } from "../types";

export function Badge({ v, theme, showAdvice }: { v: number; theme: Theme; showAdvice?: boolean }) {
  const c = spoColor(v, theme);
  const l = spoLabel(v);
  if (!l) return null;
  return (
    <span
      className="text-[10px] font-bold px-2 py-[2px] rounded-[20px] border whitespace-nowrap"
      style={{ background: c + "22", color: c, borderColor: c + "50" }}
    >
      {showAdvice ? spoAdvice(v) : l}
    </span>
  );
}
