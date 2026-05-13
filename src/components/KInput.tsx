import { useState } from "react";
import type { Theme } from "../types";

export function KInput({ theme, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { theme: Theme }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        width: "100%", background: theme === "dark" ? "#0f172a" : "#f8fafc",
        border: `1px solid ${focused ? "#3b82f6" : (theme === "dark" ? "#334155" : "#cbd5e1")}`,
        borderRadius: 10, padding: "10px 14px", fontSize: 14,
        color: theme === "dark" ? "#e2e8f0" : "#0f172a",
        outline: "none", boxSizing: "border-box",
        boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
        ...props.style,
      }}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e  => { setFocused(false); props.onBlur?.(e); }}
    />
  );
}
